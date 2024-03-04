import TicketModel from '../dao/models/ticket.model.js';
import ProductDao from '../dao/product.dao.js';
import { generateUniqueCode } from '../utils.js';



class TicketService {

    async calculateTotalAmount(cart) {
        const totalAmount = await Promise.all(cart.items.map(async (item) => {
            const product = await ProductDao.getProductById(item.productId);
            return product.price * item.quantity;
        }));
        return totalAmount.reduce((total, amount) => total + amount, 0);
    }
    
    async generateTicket(cart, purchaserEmail) {
        try {
            const amount = await this.calculateTotalAmount(cart);
            const ticket = new TicketModel({
                code: generateUniqueCode(),
                purchase_datetime: new Date().toLocaleString('es-ES'),
                amount: amount,
                purchaser: purchaserEmail
            });
            
            await ticket.save();

            return ticket;
        } catch (error) {
            console.error('Error al generar el ticket:', error);
            throw new Error('Error al generar el ticket');
        }
    }

    
}

export default new TicketService();
