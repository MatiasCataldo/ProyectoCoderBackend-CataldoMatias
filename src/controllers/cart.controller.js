import cartDao from "../dao/cart.dao.js";
import ProductDao from "../dao/product.dao.js"
import UserDao from "../dao/user.dao.js"
import ticketService from "../services/ticket.services.js"
import { sendEmail } from "../controllers/email.controller.js"
import CustomProductError from "../services/error/CustomError.js";
import { CartErrors } from "../services/error/errors-enum.js";
import { generateCartErrorInfo } from "../services/messages/cart-add-error.message.js";

// BUSCAR CARRITO POR ID
export const getCartByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const cart = await cartDao.findCartByUserId(userId);
        if (!cart) return res.json({ message: "Carrito no encontrado." });
        res.json({
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

// AGREGAR ITEM
export const addItemToCart = async (req, res) => {
    try {
        const { userId } = req.params;
        const { productName, productId, quantity, productPrice } = req.body;
        const user = await userModel.findById(userId);
        const product = await productModel.findById(productId);

        if (!productId || !quantity || !productName || !productPrice) {
            CustomProductError.createError({
                name: "Product Create Error",
                cause: generateCartErrorInfo({ productName, productId, quantity, productPrice}),
                message: "Error al intentar agregar item al carrito",
                code: CartErrors.MISSING_REQUIRED_FIELDS
            });
        }
        
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        if (user.role === 'premium' && product.owner === 'premium') {
                return res.status(403).json({ message: "No puedes agregar un producto que te pertenece a tu carrito." });
        }

        const updatedCart = await cartDao.createCartItem(userId, { productName, productId, quantity, productPrice });
        res.json({
            cart: updatedCart,
            message: "Item agregado al carrito",
        });
    } catch (error) {
        res.json({
            error,
            message: "Error al agregar el item",
        });
    }
};

// ACTUALIZAR
export const updateCartItem = async (req, res) => {
    try {
        const { userId, productId } = req.params;
        const { quantity } = req.body;
        const updatedCart = await cartDao.updateCartItem(userId, productId, quantity);
        res.json({
            cart: updatedCart,
            message: "La cantidad del item fue actualizada",
        });
    } catch (error) {
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
        const updatedCart = await cartDao.deleteCartItem(userId, productId);
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
        const updatedCart = await cartDao.clearCart(userId);
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
        const cart = await cartDao.findCartByUserId(cid);

        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado." });
        }

        const productsNotPurchased = [];
        for (const item of cart.items) {
            const product = await ProductDao.getProductById(item.productId);
            if (!product || product.stock < item.quantity) {
                productsNotPurchased.push(item.productId);
            }
        }

        if (productsNotPurchased.length > 0) {
            for (const itemNotPurchased of productsNotPurchased){
                await cartDao.deleteCartItem(cid, itemNotPurchased._id);
            }
            return res.status(400).json({ message: "Algunos productos no están disponibles." });
        }

        const userEmail = await UserDao.getUserEmailById(userId);
        console.log("id para email de ticket: ", userId);
        console.log("email ticket: ", userEmail);
        if (!userEmail) {
            return res.status(404).json({ error: "Correo electrónico del usuario no encontrado." });
        }
        const ticket = await ticketService.generateTicket(cart, userEmail);
        for (const item of cart.items) {
            await ticketService.updateProductStock(item.productId, item.quantity);
        }

        const userTiket = await UserDao.getUserById(userId)
        const nameUser = userTiket.last_name + userTiket.first_name

        await sendEmail(null, null, {
            code: ticket.code,
            purchaser: nameUser,
            purchase_datetime: ticket.purchase_datetime,
            amount: ticket.amount,
            items: cart.items 
        });
        res.json({ ticket, message: "Compra realizada con éxito." });
        await cartDao.clearCart(userId);

    } catch (error) {
        console.error("Error al procesar la compra:", error);
        res.status(500).json({ error: "Error al procesar la compra." });
    }
};
