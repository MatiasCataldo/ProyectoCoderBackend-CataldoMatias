import GenericRepository from "./GenericRepository.js";
import { generateUniqueCode } from '../utils.js';
import {ProductService} from "../services/service.js";
import TicketModel from "../dao/models/ticket.model.js";
import productModel from "../dao/models/product.model.js";
import moment from "moment-timezone"

export default class TicketRepository extends GenericRepository {
    constructor(dao) {
        super(dao);
    }

    updateProductStock = async (userId, productId, quantity) => {
        try {
            // Buscar el producto por su ID
            const product = await productModel.findById(productId);
    
            // Verificar si el producto existe
            if (!product) {
                throw new Error('Producto no encontrado');
            }
    
            // Actualizar el stock del producto
            product.stock -= quantity;
            product.owner = userId
    
            // Guardar los cambios en la base de datos
            await product.save();
    
            // Retornar el producto actualizado
            return product;
        } catch (error) {
            // Manejar errores
            throw new Error(`Error al actualizar el stock del producto: ${error.message}`);
        }
    };

    calculateTotalAmount = async (cart) => {
        const totalAmount = await Promise.all(cart.items.map(async (item) => {
            const product = await ProductService.getBy(item.productId);
            return product.price * item.quantity;
        }));
        return totalAmount.reduce((total, amount) => total + amount, 0);
    }

    generateTicket = async (cart, purchaserEmail) => {
        try {
            const amount = await this.calculateTotalAmount(cart);
            const ticket = new TicketModel({
                code: generateUniqueCode(),
                purchaser: purchaserEmail,
                purchase_datetime: moment.tz("America/Argentina/Buenos_Aires").toDate(),
                amount: amount,
                items: cart.items 
            });
            
            await ticket.save();
            return ticket;
        } catch (error) {
            console.error('Error al generar el ticket:', error);
            throw new Error('Error al generar el ticket');
        }
    }  

}