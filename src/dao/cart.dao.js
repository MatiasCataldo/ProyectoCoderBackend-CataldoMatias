import CartModel from './models/cart.model.js';

class CartDao {
    async findCartByUserId(userId) {
        return await CartModel.findById(userId);
    }

    async createCartItem(userId, cartItem) {
        console.log('userId:', userId);
        console.log('cartItem:', cartItem);
        const cart = await CartModel.findOneAndUpdate(
            { userId },
            { $push: { items: cartItem } },
            { upsert: true, new: true }
        );
        return cart;
    }

    async updateCartItem(userId, productId, quantity) {
        console.log("La cantidad del item ", productId, " fue actualizada a: ", quantity);
        return await CartModel.findOneAndUpdate(
            { userId, 'items.product': productId },
            { $set: { 'items.$.quantity': quantity } },
            { new: true }
        ).populate('items.product');
    }

    async deleteCartItem(userId, productId) {
        console.log("El item ", productId, " fue eliminado exitosamente.");
        const cart = await CartModel.findOneAndUpdate(
            { userId },
            { $pull: { items: { product: productId } } },
            { new: true }
        );
        return cart;
    }

    async clearCart(userId) {
        const cart = await CartModel.findOneAndUpdate(
            { userId },
            { $set: { items: [] } },
            { new: true }
        );
        return cart;
    }
}

export default new CartDao();
