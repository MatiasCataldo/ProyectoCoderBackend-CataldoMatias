import TicketModel from '../dao/models/ticket.model.js';
import { generateUniqueCode } from '../utils.js';

class TicketService {
    async generateTicket(cart, purchaserEmail) {
        try {
            const ticket = new TicketModel({
                code: generateUniqueCode(),
                purchase_datetime: new Date(),
                amount: this.calculateTotalAmount(cart),
                purchaser: purchaserEmail
            });
            
            await ticket.save();

            return ticket;
        } catch (error) {
            console.error('Error al generar el ticket:', error);
            throw new Error('Error al generar el ticket');
        }
    }

    calculateTotalAmount(cart) {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
}

export default new TicketService();
