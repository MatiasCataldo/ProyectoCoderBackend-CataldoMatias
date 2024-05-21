import {CartService} from "../services/service.js";
import {ProductService} from "../services/service.js"
import {UserService} from "../services/service.js"
import {ticketService} from "../services/service.js"
import { sendEmail } from "../controllers/email.controller.js"
import CustomProductError from "../services/error/CustomError.js";
import { CartErrors } from "../services/error/errors-enum.js";
import { generateCartErrorInfo } from "../services/messages/cart-add-error.message.js";
import Stripe from "stripe";

// BUSCAR CARRITO POR ID
export const getCartByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await UserService.getBy(userId);
        const cart = await CartService.getBy(user.cartId);

        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado." });
        }

        res.status(200).json({
            cart,
            message: "Carrito encontrado.",
        });
    } catch (error) {
        res.status(500).json({
            error,
            message: "Error al obtener el carrito del usuario",
        });
    }
};

// BUSCAR ID DE CARRITO POR ID
export const getCartIdByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await UserService.getBy(userId);
        const cart = await CartService.getBy(user.cartId);
        const cartId = cart._id;
        
        if (!cartId) {
            return res.status(404).json({ message: "Carrito no encontrado." });
        }

        res.status(200).json({
            cartId,
            message: "Carrito encontrado.",
        });
    } catch (error) {
        res.status(500).json({
            error,
            message: "Error al obtener el id del carrito del usuario",
        });
    }
};

// AGREGAR ITEM
export const addItemToCart = async (req, res) => {
    try {
        const { userId } = req.params;
        const { productName, productId, quantity, productPrice, productImage } = req.body;
        const user = await UserService.getBy(userId);
        const cart = await CartService.getBy(user.cartId);
        const product = await ProductService.getBy(productId);
        
        if (!productId || !quantity || !productName || !productPrice || !productImage) {
            throw new CustomProductError({
                name: "Product Create Error",
                cause: generateCartErrorInfo({ productName, productId, quantity, productPrice}),
                message: "Error al intentar agregar item al carrito",
                code: CartErrors.MISSING_EQUIRED_FIELDS
            });
        }
        
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        /*if (user.role !== 'premium' && product.owner !== user._id) {
            return res.status(403).json({ message: "No puedes agregar un producto que NO te pertenece a tu carrito." });
        }*/
        
        let updatedCart = cart;
        const productIdExists = updatedCart.items.some(item => {
            console.log(item.productId);
            return item.productId == productId;
        });

        if (productIdExists) {
            updatedCart = await CartService.updateCartItem(userId, productId, quantity);
        } else {
            updatedCart = await CartService.create({ userId, cartItem: { productName, productId, quantity, productPrice, productImage } });
        }

        res.status(201).json({
            cart: updatedCart,
            message: "Item agregado al carrito",
        });
    } catch (error) {
        console.error("Error al agregar el item:", error);
        res.status(500).json({ message: "Error al agregar el item" });
    }
};


// ACTUALIZAR
export const updateCartItem = async (req, res) => {
    try {
        const { userId, productId } = req.params;
        const { quantity } = req.body;
        const updatedCart = await CartService.updateCartItem(userId, productId, quantity);
        res.json({
            cart: updatedCart,
            message: "La cantidad del item fue actualizada",
        });
    } catch (error) {
        console.error("Error al actualizar la cantidad del item en el carrito:", error);
        res.status(500).json({
            error,
            message: "Error al actualizar la cantidad del item en el carrito",
        });
    }
};

// ELIMINAR ITEM
export const deleteCartItem = async (req, res) => {
    try {
        const { userId, productId } = req.params;
        const updatedCart = await CartService.deleteCartItem(userId, productId);
        res.json({
            cart: updatedCart,
            message: "Item eliminado del carrito",
        });
    } catch (error) {
        res.status(500).json({
            error,
            message: "Error al eliminar el item del carrito",
        });
    }
};

// VACIAR CARRITO
export const clearCart = async (req, res) => {
    try {
        const { userId } = req.params;
        const updatedCart = await CartService.clearCart(userId);
        res.json({
            cart: updatedCart,
            message: "Carrito vaciado",
        });
    } catch (error) {
        res.status(500).json({
            error,
            message: "Error al vaciar el carrito",
        });
    }
};

// GENERAR TICKET
export const purchase = async (req, res) => {
    try {
        const { cid, userId } = req.params;
        const cart = await CartService.getBy(cid);

        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado." });
        }

        const productsNotPurchased = [];
        for (const item of cart.items) {
            const product = await ProductService.getBy(item.productId);
            if (!product || product.stock < item.quantity) {
                productsNotPurchased.push(item.productId);
            }
        }

        if (productsNotPurchased.length > 0) {
            for (const itemNotPurchased of productsNotPurchased){
                await CartService.deleteCartItem(userId, itemNotPurchased._id);
            }
            return res.status(400).json({ message: "Algunos productos no están disponibles." });
        }

        const userEmail = await UserService.getUserEmailById(userId);
        if (!userEmail) {
            return res.status(404).json({ error: "Correo electrónico del usuario no encontrado." });
        }

        const ticket = await ticketService.generateTicket(cart, userEmail);
        for (const item of cart.items) {
            await ticketService.updateProductStock(userId, item.productId, item.quantity);
        }

        let totalAmount = 0;
        for (const item of cart.items) {
            const itemTotal = item.productPrice * item.quantity;
            console.log(`Price for ${item.productName}: ${item.productPrice} * ${item.quantity} = ${itemTotal}`);
            totalAmount += itemTotal;
        }
        
        const userTiket = await UserService.getBy(userId)
        const nameUser = userTiket.last_name + " " + userTiket.first_name

        await sendEmail(userEmail, {
            code: ticket.code,
            purchaser: nameUser,
            purchase_datetime: ticket.purchase_datetime,
            amount: ticket.amount,
            items: cart.items 
        });
        res.status(200).json({ ticket, message: "Compra realizada con éxito." });
        await CartService.clearCart(userId);

    } catch (error) {
        console.error("Error al procesar la compra:", error);
        res.status(500).json({ error: "Error al procesar la compra." });
    }
};
