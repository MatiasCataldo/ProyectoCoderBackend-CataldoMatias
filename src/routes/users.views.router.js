import { Router } from "express";
import passport from "passport";
import { authToken } from '../utils.js';
import ProductManager from '../../main.js';
import { passportCall, authorization } from "../utils.js";

const router = Router();
const manejadorProductos = new ProductManager();

router.get("/login", (req, res) => {
    res.render("login");
});

router.get("/register", (req, res) => {
    res.render("register");
});

router.get("/cart", (req, res) => {
    res.render("cart");
});


router.get('/updatePassword', (req, res) => {
    res.render('updatePassword');
});

// Endpoint que renderiza la vista del perfil de usuario
router.get("/",
    passportCall('jwt'),
    authorization('user'),
    (req, res) => {
        res.render("home", {
            products: manejadorProductos.getProducts(),
            user: req.user
        });
    }
);

router.get("*", (req, res) => {
    res.render("error");
});

router.get("/error", (req, res) => {
    res.render("error");
});

export default router;