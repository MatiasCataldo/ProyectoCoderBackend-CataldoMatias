import CartModel from './models/cart.model.js';

export default class CartDao {
    async getBy(cartId) {
        return await CartModel.findById(cartId);
    }

    async save(doc) {
        const { userId, cartItem } = doc;
        let cart = await CartModel.findOne({ userId });
    
        if (!cart) {
            // Si no hay un carrito existente, crea uno nuevo
            cart = await CartModel.create({ userId, items: [cartItem] });
        } else {
            // Si el carrito existe, agrega el nuevo item a la lista de items
            cart.items.push(cartItem);
            await cart.save();
        }
    
        return cart;
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

}
