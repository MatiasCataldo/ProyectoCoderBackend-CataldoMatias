import CartModel from './models/cartModel.js';

class CartDao {
    async findCartByUserId(userId) {
        return await CartModel.findOne({ userId });
    }

    async createCartItem(userId, cartItem) {
        const cart = await CartModel.findOneAndUpdate(
            { userId },
            { $push: { items: cartItem } },
            { upsert: true, new: true }
        );
        return cart;
    }

    async updateCartItem(userId, productId, quantity) {
        return await CartModel.findOneAndUpdate(
            { userId, 'items.productId': productId },
            { $set: { 'items.$.quantity': quantity } },
            { new: true }
        );
    }

    async deleteCartItem(userId, productId) {
        return await CartModel.findOneAndUpdate(
            { userId },
            { $pull: { items: { productId } } },
            { new: true }
        );
    }

    async clearCart(userId) {
        return await CartModel.findOneAndUpdate(
            { userId },
            { $set: { items: [] } },
            { new: true }
        );
    }
}

export default new CartDao();
