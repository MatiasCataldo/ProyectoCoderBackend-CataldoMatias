import express from "express";
import handlebars from "express-handlebars";
import http from "http";
import { Server } from "socket.io";
import __dirname from "./utils.js";
import path from "path";
import mongoose from "mongoose";
import ProductManager from "../main.js";
import productsRouter from "./routes/product.router.js";
import messagesRouter from "./routes/messages.routes.js"
import messageDao from "./dao/message.dao.js";
import cartDao from "./dao/cart.dao.js";
import cartsRouter from "./routes/cart.router.js";
import userRouter from "./routes/user.router.js"


const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

app.engine("hbs",handlebars.engine({
    extname: "hbs",
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "views/layouts"),
  })
);

mongoose.connect("mongodb://127.0.0.1/ecommerce").then(() => {
    console.log("Connected DB");
  })
  .catch((error) => {
    console.log(error);
    console.log("Error connecting db");
  });

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Error de conexión a MongoDB:"));
db.once("open", () => {
  console.log("Conexión exitosa a MongoDB");
});

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

const manejadorProductos = new ProductManager();

const httpServer = http.createServer(app);
const socketServer = new Server(httpServer);

socketServer.on("connection", (socketClient) => {
  console.log("Nuevo cliente conectado");

  socketClient.on("createProduct", (newProduct) => {
    const product = {
      id: newProduct.id,
      title: newProduct.title,
      description: newProduct.description,
      price: newProduct.price,
      thumbnail: newProduct.thumbnail,
      stock: newProduct.stock,
      category: newProduct.category,
    };
    console.log("Nuevo producto server :", product);
    manejadorProductos.addProduct(product);
    socketServer.emit("productListUpdated", manejadorProductos.getProducts());
  });

  socketClient.on("deleteProduct", (productCode) => {
    manejadorProductos.deleteProduct(productCode);
    socketServer.emit("productListUpdated", manejadorProductos.getProducts());
  });

  socketClient.on('addToCart', async ({ userId, productId, quantity }) => {
    try {
        const cart = await cartDao.findCartByUserId(userId);
        const existingItem = cart.items.find(item => item.productId === productId);
        if (existingItem) {
            const updatedCart = await cartDao.updateCartItem(userId, productId, existingItem.quantity + quantity);
            socketClient.emit('cartUpdated', updatedCart);
        } else {
            const newCartItem = { productId, quantity };
            const updatedCart = await cartDao.createCartItem(userId, newCartItem);
            socketClient.emit('cartUpdated', updatedCart);
        }
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
    }
  });
  
});

app.use("/api/products", productsRouter);
app.use("/api/messages", messagesRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", userRouter);


app.get("/", (req, res) => {
  res.render("home", { products: manejadorProductos.getProducts() });
});

app.get("/realtimeproducts", (req, res) => {
  res.render("realtimeproducts", { products: manejadorProductos.getProducts() });
});


app.get("/messages", (req, res) => {
  res.render("chat", { messages: messageDao.getAllMessages() });
});

app.get("/cart", (req, res) => {
  res.render("cart", {cartItems: cartDao.getAllCartItems() });
});


httpServer.listen(PORT, () =>
  console.log(`Server listening on port ${PORT}`)
);
