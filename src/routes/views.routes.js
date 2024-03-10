import express from 'express';
import cookieParser from 'cookie-parser';
import ProductManager from '../../main.js';
import { passportCall, authorization } from "../utils.js";

const router = express.Router();
const manejadorProductos = new ProductManager();

// LOGIN
router.get("/login", (req, res) => {
    res.render("login");
});

// REGISTER
router.get("/register", (req, res) => {
    res.render("register");
});

// CART
router.get("/cart", (req, res) => {
    res.render("cart");
});

// UPDATE PASSWORD
router.get('/updatePassword', (req, res) => {
    res.render('updatePassword');
});

// HOME
router.get('/home', (req, res) => {
    res.render('home', {
        products: manejadorProductos.getProducts(),
        user: req.user
    });
});

// HOME USER
router.get("/home/user",
    passportCall('jwt'),
    authorization('user'),
    (req, res) => {
        res.render("home", {
            products: manejadorProductos.getProducts(),
            user: req.user
        });
    }
);

// REALTIMEPRODUCTS
router.get("/realTimeProducts", (req, res) => {
    res.render("realTimeProducts");
});

//CHAT
router.get('/chat', (req, res) => {
    res.render("chat");
});

// CART ID
router.get("/carts/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartDao.findCartByUserId(cid);
        if (!cart) {
            return res.render("error", { message: "Carrito no encontrado" });
        }

        const cartItems = cart.items;
        res.render("cart", { cartItems });
    } catch (error) {
        console.error(error);
        res.render("error", { message: "Error al obtener el carrito" });
    }
});

// Rutas relacionadas con cookies
router.use(cookieParser('MatiS3cr3tC0d3'));

router.get('/setcookie', (req, res) => {
    res.cookie('CooderCookie', 'Esta es una cookie con firma!!', { maxAge: 20000, signed: true }).send('Cookie asignada con exito!')
});

router.get('/getcookie', (req, res) => {
    res.send(req.signedCookies)
});

router.get('/deletecookie', (req, res) => {
    res.clearCookie('CooderCookie').send('Cookie borrada con exito!!')
});

// Rutas relacionadas con la sesión
router.get('/session', (req, res) => {
    if (req.session.counter) {
        req.session.counter++;
        res.send(`Se ha visitado este sitio ${req.session.counter} veces.`);
    } else {
        req.session.counter = 1;
        res.send('Bienvenido!');
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy(error => {
        if (error) {
            res.json({ error: 'Error logout', msg: "Error al cerrar la session" })
        }
        res.send('Session cerrada con exito!')
    })
});

/*router.get('/login', (req, res) => {
    const { username, password } = req.query;
    if (username != 'mati' || password !== 'mati123') {
        return res.status(401).send("Error de Login, usuario o contraseña incorrecta.");
    } else {
        req.session.user = username;
        req.session.admin = true;
        res.send('Login exitoso!!')
    }
});
*/

function auth(req, res, next) {
    if (req.session.user === 'mati' && req.session.admin) {
        return next()
    } else {
        return res.status(403).send("Usuario no autorizado para ingresar.");
    }
}

router.get('/private', auth, (req, res) => {
    res.send('Si estas viendo esto es porque estas autorizado!');
});

// Rutas relacionadas con el login con GitHub
router.get("/github/login", (req, res) => {
    res.render("github-login");
});

router.get("/github/error", (req, res) => {
    res.render("error", { error: "No se pudo autenticar usando GitHub!" });
});

export default router;
