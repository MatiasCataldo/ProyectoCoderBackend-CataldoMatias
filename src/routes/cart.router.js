import { Router } from "express";
import cartDao from "../dao/cart.dao.js";
import ticketService from "../services/ticket.services.js";
import { generateUniqueCode } from '../utils.js';

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
            const product = await productService.getProductById(item.productId);
            if (!product || product.stock < item.quantity) {
                productsNotPurchased.push(item.productId);
            }
        }

        if (productsNotPurchased.length > 0) {
            await cartDao.removeItemsFromCart(cid, productsNotPurchased);
            return res.status(400).json({ message: "Algunos productos no están disponibles." });
        }

        const ticketData = {
            code: generateUniqueCode(),
            purchase_datetime: new Date(),
            amount: calculateTotalAmount(cart.items),
            purchaser: userId
        };
        const ticket = await ticketService.createTicket(ticketData);
        await cartDao.removeItemsFromCart(cid, cart.items.map(item => item.productId));
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
