import cartDao from "../dao/cart.dao.js";

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
        console.log(error);
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
        const cartItem = req.body;
        const updatedCart = await cartDao.createCartItem(userId, cartItem);
        res.json({
            cart: updatedCart,
            message: "Item agregado al carrito",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error,
            message: "Error al agregar el item al carrito",
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
        console.log(error);
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
        console.log(error);
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
        console.log(error);
        res.status(500).json({
            error,
            message: "Error al vaciar el carrito",
        });
    }
};
