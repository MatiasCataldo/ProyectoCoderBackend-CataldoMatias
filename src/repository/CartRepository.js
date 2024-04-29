import GenericRepository from "./GenericRepository.js";
import cartModel from "../dao/models/cart.model.js";
import userModel from "../dao/models/user.model.js";

export default class CartRepository extends GenericRepository {
    constructor(dao) {
        super(dao);
    }

    getByUser = async (userId) => {
        return await cartModel.findOne({ userId });
    }

    createNewCart = async (userId) => {
        const cart = await cartModel.create({ userId }); // Espera a que se cree el carrito
        await userModel.findByIdAndUpdate(userId, { cart: cart._id }); // Espera a que se actualice el usuario
        return cart;
    }

    updateCartItem = async (userId, productId, quantity) => {
        const cart = await cartModel.findOneAndUpdate(
            { userId, 'items.productId': productId },
            { $inc: { 'items.$.quantity': quantity } },
            { new: true }
        );
        return cart;
    };
    

    async deleteCartItem(userId, productId) {
        const cart = await cartModel.findOneAndUpdate(
            { userId },
            { $pull: { items: { productId: productId } } },
            { new: true }
        );
        return cart;
    }
    

    clearCart = async (userId) => {
        const cart = await cartModel.findOneAndUpdate(
            { userId },
            { $set: { items: [] } },
            { new: true }
        );
        return cart;
    }
    
    
}