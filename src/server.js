//IMPORT LIBRARYS
import express from "express";
import handlebars from "express-handlebars";
import http from "http";
import path from "path";
import MongoStore from 'connect-mongo'
import session from "express-session";
import passport from "passport";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUIExpress from "swagger-ui-express";

//IMPORT ROUTERS
import mockingRouter from "./routes/mocking.router.js"
import productsRouter from "./routes/product.router.js";
import messagesRouter from "./routes/messages.router.js";
import cartsRouter from "./routes/cart.router.js";
import userRouter from "./routes/user.router.js";
import jwtRouter from './routes/jwt.router.js';
import emailRouter from './routes/email.router.js';
import smsRouter from './routes/sms.router.js';

//IMPORT VIEWS
import viewsRouter from "./routes/views.routes.js";

//IMPORTS
import __dirname, { authToken } from "./utils.js";
import { passportCall, authorization } from './utils.js';
import initializePassport from "./config/passport.config.js";
import config from './config/config.js';
import { addLogger } from "./config/logger_CUSTOM.js";
import MongoSingleton from './config/mongodb-singleton.js';

// CONSTANTES DE ENTORNO
const COOKIE_SECRET = config.cookieSecret;
//mongodb://127.0.0.1/clase40-adoptme-test - mongodb://127.0.0.1/ecommerce
const MONGO_URL = "mongodb://127.0.0.1/ecommerce";
const app = express();
const SERVER_PORT = config.port;
const httpServer = http.createServer(app);

//APP SETTINGS
dotenv.config();
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(COOKIE_SECRET));
app.use(addLogger);
app.use(express.static(path.join(__dirname, 'public'), { 'extensions': ['html', 'css'] }));
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

//MONGOSINLGETON
async function initializeMongoService() {
  console.log("Iniciando Servicio para MongoDB !!");
  try {
      await MongoSingleton.getInstance();
  } catch (error) {
      console.error("Error al iniciar MongoDB:", error);
      process.exit(1);
  }
}

initializeMongoService()


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


// SWAGGER
const swaggerOptions = {
  definition: { 
      openapi: "3.0.1",
      info: {
          title: "Documentacion API Adopme",
          description: "Documentacion para uso de swagger"
      }
  },
  apis: [`${__dirname}/docs/**/*.yaml`]
}

const specs = swaggerJSDoc(swaggerOptions);
app.use('/apidocs', swaggerUIExpress.serve, swaggerUIExpress.setup(specs))

// ROUTER APIS
app.use("/api/products", passportCall('jwt'), authorization(['admin', 'premium']), productsRouter);
app.use("/api/messages", passportCall('jwt'), authorization('user'), messagesRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", passportCall('jwt'), authorization(['admin', 'premium']), userRouter);
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