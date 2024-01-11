import { Router } from "express";
import cartDao from "../dao/cart.dao.js";

const router = Router();

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
