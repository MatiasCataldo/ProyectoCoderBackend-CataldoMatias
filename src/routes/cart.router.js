import { Router } from "express";
import cartDao from "../dao/cart.dao.js";
import ProductDao from "../dao/product.dao.js"
import UserDao from "../dao/user.dao.js"
import ticketService from "../services/ticket.services.js";
import { generateUniqueCode } from '../utils.js';
import { sendEmail } from "../controllers/email.controller.js"

const router = Router();

// Función para calcular el monto total de la compra
function calculateTotalAmount(items) {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
}

router.post("/:userId/:cid/purchase", async (req, res) => {
    try {
        const { cid } = req.params;
        const { userId } = req.params;
        const cart = await cartDao.findCartByUserId(cid);

        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado." });
        }

        const productsNotPurchased = [];
        for (const item of cart.items) {
            const product = await ProductDao.getProductById(item.productId);
            console.log("producto for: ", product);
            if (!product || product.stock < item.quantity) {
                productsNotPurchased.push(item.productId);
                console.log("producto purchased: ", product);
            }
        }

        if (productsNotPurchased.length > 0) {
            for (const item of productsNotPurchased) {
                await cartDao.deleteCartItem( cid, item._id )
            }
            return res.status(400).json({ message: "Algunos productos no están disponibles." });
        }

        const ticketData = {
            code: generateUniqueCode(),
            purchase_datetime: new Date(),
            amount: calculateTotalAmount(cart.items),
            purchaser: userId
        };
        const userEmail = await UserDao.getUserEmailById(userId);
        console.log("id para email de ticket: ", userId);
        console.log("email ticket: ", userEmail);
        /*if (!userEmail || !userEmail.email) {
            return res.status(404).json({ error: "Correo electrónico del usuario no encontrado." });
        }*/
        const ticket = await ticketService.generateTicket(cart, userEmail.email);
        await cartDao.clearCart(userId);
        await sendEmail(null, null, {
            code: ticket.code,
            purchase_datetime: ticket.purchase_datetime,
            amount: ticket.amount,
            purchaser: ticket.purchaser
        });
        res.json({ ticket, message: "Compra realizada con éxito." });

    } catch (error) {
        console.error("Error al procesar la compra:", error);
        res.status(500).json({ error: "Error al procesar la compra." });
    }
});

router.get("/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const cart = await cartDao.findCartByUserId(userId);
        if (!cart) return res.json({ message: "Carrito no encontrado." });
        res.json({
            cart,
            message: "Carrito encontrado.",
        });
    } catch (error) {
        console.log(error);
        res.json({
            error,
            message: "Error",
        });
    }
});

router.post("/:userId/addItem", async (req, res) => {
    try {
        const { userId } = req.params;
        const cartItem = req.body;
        const updatedCart = await cartDao.createCartItem(userId, cartItem);
        res.json({
            cart: updatedCart,
            message: "Item agregado al carrito",
        });
    } catch (error) {
        console.log(error);
        res.json({
            error,
            message: "Error al agregar el item",
        });
    }
});

router.put("/:userId/updateItem/:productId", async (req, res) => {
    try {
        const { userId, productId } = req.params;
        const { quantity } = req.body;
        const updatedCart = await cartDao.updateCartItem(userId, productId, quantity);
        res.json({
            cart: updatedCart,
            message: "La cantidad del item fue actualizada",
        });
    } catch (error) {
        console.log(error);
        res.json({
            error,
            message: "Error",
        });
    }
});

router.delete("/:userId/deleteItem/:productId", async (req, res) => {
    try {
        const { userId, productId } = req.params;
        const updatedCart = await cartDao.deleteCartItem(userId, productId);
        res.json({
            cart: updatedCart,
            message: "Item eliminado del carrito",
        });
    } catch (error) {
        console.log(error);
        res.json({
            error,
            message: "Error",
        });
    }
});

router.delete("/:userId/clearCart", async (req, res) => {
    try {
        const { userId } = req.params;
        const updatedCart = await cartDao.clearCart(userId);
        res.json({
            cart: updatedCart,
            message: "Carrito vaciado",
        });
    } catch (error) {
        console.log(error);
        res.json({
            error,
            message: "Error",
        });
    }
});

export default router;
