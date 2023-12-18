import { Router } from "express";
import cartDao from "../dao/cartDao.js";

const router = Router();

router.get("/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const cart = await cartDao.findCartByUserId(userId);
        if (!cart) return res.json({ message: "Cart not found" });
        res.json({
            cart,
            message: "Cart found",
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
            message: "Item added to cart",
        });
    } catch (error) {
        console.log(error);
        res.json({
            error,
            message: "Error",
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
            message: "Item quantity updated in cart",
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
            message: "Item deleted from cart",
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
            message: "Cart cleared",
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
