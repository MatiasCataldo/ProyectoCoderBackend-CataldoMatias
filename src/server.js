//IMPORT LIBRARYS
import express from "express";
import handlebars from "express-handlebars";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import MongoStore from 'connect-mongo'
import session from "express-session";
import passport from "passport";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv'; // Importa dotenv

//IMPORT ROUTERS
import mockingRouter from "./routes/mocking.router.js"
import productsRouter from "./routes/product.router.js";
import messagesRouter from "./routes/messages.router.js";
import cartsRouter from "./routes/cart.router.js";
import userRouter from "./routes/user.router.js";
import jwtRouter from './routes/jwt.router.js';
import emailRouter from './routes/email.router.js';
import smsRouter from './routes/sms.router.js';

//IMPORT DAO
import cartDao from "./dao/cart.dao.js";

//IMPORT VIEWS
import viewsRouter from "./routes/views.routes.js";

//IMPORTS
import ProductManager from "../main.js";
import __dirname from "./utils.js";
import { passportCall, authorization } from './utils.js';
import initializePassport from "./config/passport.config.js";
import config from './config/config.js';
import { initializeAndExportServices } from "./services/factory.js";
import { addLogger } from "./config/logger_CUSTOM.js";

// CONSTANTES DE ENTORNO
const COOKIE_SECRET = process.env.COOKIE_SECRET;
const MONGO_URL = "mongodb://127.0.0.1/ecommerce";
const app = express();
const SERVER_PORT = config.port;
const manejadorProductos = new ProductManager();
const httpServer = http.createServer(app);
const socketServer = new Server(httpServer);
const { userService, productService } = await initializeAndExportServices();

//APP SETTINGS
dotenv.config();
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(COOKIE_SECRET));
app.use(addLogger);
app.use(express.static(path.join(__dirname, 'public'), { 'extensions': ['html', 'css'] }));
app.use(cookieParser("unSecreto"));
app.use(session(
  {
      store: MongoStore.create({
            mongoUrl: MONGO_URL,
            ttl: 10 * 60  
        }),
        secret: "coderS3cr3t",
        resave: false, 
        saveUninitialized: true 
    }
))

//PASSPORT
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

//HANDLEBARS
app.engine("hbs",handlebars.engine({
  extname: "hbs",
  defaultLayout: "main",
  layoutsDir: path.join(__dirname, "views/layouts"),
})
);

// SOCKET
socketServer.on("connection", (socketClient) => {
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
  
  socketClient.on('cartUpdated', (updatedCart) => {
    const cartItemCountElement = document.getElementById('cartItemCount');
    if (cartItemCountElement) {
      cartItemCountElement.textContent = updatedCart.items.length;
    }
  
    const cartItemListElement = document.getElementById('cartItemList');
    if (cartItemListElement) {
      cartItemListElement.innerHTML = '';
      updatedCart.items.forEach((item) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.product.title} - Cantidad: ${item.quantity}`;
        cartItemListElement.appendChild(listItem);
      });
    }

    const cartTotalPriceElement = document.getElementById('cartTotalPrice');
    if (cartTotalPriceElement) {
      cartTotalPriceElement.textContent = `$${updatedCart.totalPrice}`;
    }
  });  

});

// ROUTER APIS
app.use("/api/products", passportCall('jwt'), authorization(['admin', 'premium']), productsRouter);
app.use("/api/messages", passportCall('jwt'), authorization('user'), messagesRouter);
app.use("/api/carts", passportCall('jwt'), authorization('admin', 'premium'), cartsRouter);
app.use("/api/users", passportCall('jwt'), authorization('admin', 'premium'), userRouter);
app.use("/api/jwt", jwtRouter);
app.use("/api/email", emailRouter);
app.use("/api/sms", smsRouter);
app.use("/mockingproducts", mockingRouter);

// ROUTER VISTAS
app.use("/", viewsRouter);

//  SERVER LISTENING
httpServer.listen(SERVER_PORT, () =>
  console.log(`Server listening on port ${SERVER_PORT}`)
);