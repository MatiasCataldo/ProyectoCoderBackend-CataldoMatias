import express from 'express';
import cookieParser from 'cookie-parser';
import ProductManager from '../../main.js';


const router = express.Router();
const manejadorProductos = new ProductManager();

router.get("/", (req, res) => {
  res.render('home', {
      products: manejadorProductos.getProducts(),
      user: req.session.user
  })
})

router.get('/realtimeproducts', (req, res) => {
  res.render('realtimeproducts');
});

router.get('/chat', (req, res) => {
  res.render('chat');
});

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

//COOKIES:
router.use(cookieParser('MatiS3cr3tC0d3'))

router.get('/setcookie', (req, res) => {
  res.cookie('CooderCookie', 'Esta es una cookie con firma!!', { maxAge: 20000, signed: true }).send('Cookie asignada con exito!')
});

router.get('/getcookie', (req, res) => {
  res.send(req.signedCookies)
});

router.get('/deletecookie', (req, res) => {
  res.clearCookie('CooderCookie').send('Cookie borrada con exito!!')
});

//SESSION:
router.get('/session', (req, res) => {
  if (req.session.counter) {
    req.session.counter++;
    res.send(`Se ha visitado este sitio ${req.session.counter} veces.`);
  } else{
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

router.get('/login', (req, res) => {
  const { username, password } = req.query;
  if (username != 'mati' || password !== 'mati123') {
      return res.status(401).send("Error de Login, usuario o contraseña incorrecta.");
  } else {
      req.session.user = username;
      req.session.admin = true;
      res.send('Login exitoso!!')
  }
});

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

export default router;
