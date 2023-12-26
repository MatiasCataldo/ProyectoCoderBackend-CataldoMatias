import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.render('home');
});

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

export default router;
