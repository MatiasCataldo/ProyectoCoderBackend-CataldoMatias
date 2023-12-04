import express from "express";
import handlebars from "express-handlebars";
import http from "http";
import { Server } from "socket.io";
import __dirname from "./utils.js";
import path from "path";
import productsRouter from "./routes/products.router.js";
import ProductManager from "../main.js";
import Product from "../main.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine(
  "hbs",handlebars.engine({
    extname: "hbs",
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "views/layouts"),
  })
);

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

const manejadorProductos = new ProductManager();

const httpServer = app.listen(PORT, () =>
  console.log(`Server listening on port ${PORT}`)
);

const socketServer = new Server(httpServer);

socketServer.on("connection", (socketClient) => {
  console.log("Nuevo cliente conectado");

  socketClient.on("createProduct", (newProduct) => {
    const product = new Product(
      newProduct.id,
      newProduct.title,
      newProduct.description,
      newProduct.price,
      newProduct.thumbnail,
      newProduct.stock,
      newProduct.category
    );
    manejadorProductos.addProduct(product);
    socketServer.emit("productListUpdated", manejadorProductos.getProducts());
  });

  socketClient.on("deleteProduct", (productId) => {
    manejadorProductos.deleteProduct(productId);
    socketServer.emit("productListUpdated", manejadorProductos.getProducts());
  });
});

app.get("/", (req, res) => {
  res.render("home", { products: manejadorProductos.getProducts() });
});

app.get("/realtimeproducts", (req, res) => {
  res.render("realtimeproducts", { products: manejadorProductos.getProducts() });
});
