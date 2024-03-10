//Librerias
import express from "express";
import handlebars from "express-handlebars";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import mongoose from "mongoose";
import MongoStore from 'connect-mongo'
import session from "express-session";
import passport from "passport";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv'; // Importa dotenv

//Routers
import productsRouter from "./routes/product.router.js";
import messagesRouter from "./routes/messages.router.js";
import cartsRouter from "./routes/cart.router.js";
import userRouter from "./routes/user.router.js";
import jwtRouter from './routes/jwt.router.js';
import emailRouter from './routes/email.router.js';
import smsRouter from './routes/sms.router.js';

//Daos
import messageDao from "./dao/message.dao.js";
import cartDao from "./dao/cart.dao.js";

//Vistas
//import usersViewRouter from './routes/users.views.router.js';
import viewsRouter from "./routes/views.routes.js";
//import githubLoginViewRouter from "./routes/github-login.views.router.js"

//Importciones
import ProductManager from "../main.js";
import __dirname from "./utils.js";
import { authorize } from './utils.js';
import initializePassport from "./config/passport.config.js";
import config from './config/config.js';
import MongoSingleton from './config/mongodb-singleton.js';
import { initializeAndExportServices } from './services/factory.js';

//Custom - Extended
import UsersExtendRouter from './routes/custom/users.extend.router.js'

dotenv.config();

const COOKIE_SECRET = process.env.COOKIE_SECRET;
const  MONGO_URL = "mongodb://127.0.0.1/ecommerce";
const app = express();
const SERVER_PORT = config.port;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(COOKIE_SECRET));
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

//MONGO-SINGLETON
/*const mongoInstance = async () => {
  try {
      await MongoSingleton.getInstance()
  } catch (error) {
      console.log(error);
  }
}
mongoInstance()*/
const { userService, productService } = await initializeAndExportServices();
//HANDLEBARS
app.engine("hbs",handlebars.engine({
  extname: "hbs",
  defaultLayout: "main",
  layoutsDir: path.join(__dirname, "views/layouts"),
})
);

const hbs = handlebars.create({
  helpers: {
    eq: function (a, b, options) {
      return a === b ? options.fn(this) : options.inverse(this);
    }
  }
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
  
  socketClient.on('cartUpdated', (updatedCart) => {
    // Actualizar la cantidad de elementos en el carrito
    const cartItemCountElement = document.getElementById('cartItemCount');
    if (cartItemCountElement) {
      cartItemCountElement.textContent = updatedCart.items.length;
    }
  
    // Actualizar la lista de productos en el carrito
    const cartItemListElement = document.getElementById('cartItemList');
    if (cartItemListElement) {
      // Limpiar la lista antes de agregar los nuevos elementos
      cartItemListElement.innerHTML = '';
  
      // Recorrer los elementos del carrito y agregarlos a la lista
      updatedCart.items.forEach((item) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.product.title} - Cantidad: ${item.quantity}`;
        cartItemListElement.appendChild(listItem);
      });
    }
  
    // Actualizar el precio total del carrito
    const cartTotalPriceElement = document.getElementById('cartTotalPrice');
    if (cartTotalPriceElement) {
      cartTotalPriceElement.textContent = `$${updatedCart.totalPrice}`;
    }
  });  

});

//PASSPORT
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// ROUTER APIS
app.use("/api/products", authorize(['admin']), productsRouter);
app.use("/api/messages", authorize(['user']), messagesRouter);
app.use("/api/carts", authorize(['user']), cartsRouter);
app.use("/api/users", authorize(['user']), userRouter);
app.use("/api/jwt", jwtRouter);
app.use("/api/email", emailRouter);
app.use("/api/sms", smsRouter);

// ROUTER VISTAS
app.use("/", viewsRouter);

const usersExtendRouter = new UsersExtendRouter();
app.use("/api/extend/users", usersExtendRouter.getRouter());


httpServer.listen(SERVER_PORT, () =>
  console.log(`Server listening on port ${SERVER_PORT}`)
);
