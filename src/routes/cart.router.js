import { Router } from "express";
import { getCartByUserId, addItemToCart, updateCartItem, deleteCartItem, clearCart, purchase} from "../controllers/cart.controller.js";

const router = Router();

router.get("/:userId", getCartByUserId);

router.post("/:userId/addItem", addItemToCart);

router.put("/:userId/updateItem/:productId", updateCartItem);

router.delete("/:userId/deleteItem/:productId", deleteCartItem);

router.delete("/:userId/clearCart", clearCart);

router.post("/:userId/:cid/purchase", purchase);

export default router;
