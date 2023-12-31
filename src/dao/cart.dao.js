import CartModel from './models/cart.model.js';

class CartDao {
    async findCartByUserId(userId) {
        return await CartModel.findOne({ userId }).populate('items.product');
    }

    async createCartItem(userId, cartItem) {
        const cart = await CartModel.findOneAndUpdate(
            { userId },
            { $push: { items: cartItem } },
            { upsert: true, new: true }
        ).populate('items.product');
        return cart;
    }

    async updateCartItem(userId, productId, quantity) {
        return await CartModel.findOneAndUpdate(
            { userId, 'items.product': productId },
            { $set: { 'items.$.quantity': quantity } },
            { new: true }
        ).populate('items.product');
    }

    async deleteCartItem(userId, productId) {
        const cart = await CartModel.findOneAndUpdate(
            { userId },
            { $pull: { items: { product: productId } } },
            { new: true }
        ).populate('items.product');
        return cart;
    }

    async clearCart(userId) {
        const cart = await CartModel.findOneAndUpdate(
            { userId },
            { $set: { items: [] } },
            { new: true }
        ).populate('items.product');
        return cart;
    }
}

export default new CartDao();
