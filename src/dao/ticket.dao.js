import TicketModel from '../dao/models/ticket.model.js';
import ProductDao from '../dao/product.dao.js';
import { generateUniqueCode } from '../utils.js';

export default class TicketService {
    async updateProductStock(productId, quantity) {
        await ProductDao.updateProductStock(productId, quantity);
    }

    async calculateTotalAmount(cart) {
        const totalAmount = await Promise.all(cart.items.map(async (item) => {
            const product = await ProductDao.getProductById(item.productId);
            return product.price * item.quantity;
        }));
        return totalAmount.reduce((total, amount) => total + amount, 0);
    }

    formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }  
}

