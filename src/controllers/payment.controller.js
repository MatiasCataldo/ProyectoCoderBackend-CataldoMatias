import stripePackage from 'stripe';
import { UserService } from "../services/service.js";
import { CartManager } from '../../main.js';

const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);
const YOUR_DOMAIN = process.env.DOMAIN;
const manejadorItemsCart = new CartManager();

export const createCheckoutSession = async (req, res) => {
  try {
    const cookieToken = req.cookies.jwtCookieToken;
    const cookieEmail = req.cookies.email;
    const user = await UserService.getByEmail(cookieEmail);

    if (!user) {
      console.log('Usuario no encontrado');
      return res.status(404).send('Usuario no encontrado');
    }

    const userId = user._id.toString();
    const data = await manejadorItemsCart.getCartItems(cookieToken, userId);

    if (!data || !data.cart) {
      console.error('Carrito no encontrado');
      return res.status(404).send('Carrito no encontrado');
    }

    const { cart } = data; 
    const { items } = cart;

    if (!items || !Array.isArray(items)) {
      console.error('Items no encontrados o no es un arreglo');
      return res.status(400).send('Items no encontrados o no es un arreglo');
    }

    const lineItems = items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.productName,
          images: [item.productImage],
        },
        unit_amount: item.productPrice * 100,
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: 'payment',
      success_url: `${YOUR_DOMAIN}/successPayment`,
      cancel_url: `${YOUR_DOMAIN}/home/user`,
    });

    res.redirect(303, session.url);
  } catch (error) {
    console.error('Error al crear la sesión de pago:', error);
    res.status(500).send('Error interno del servidor');
  }
};
