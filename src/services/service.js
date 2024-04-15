import Users from "../dao/user.dao.js";
import Products from "../dao/product.dao.js";
import Carts from "../dao/cart.dao.js";
import Tickets from "../dao/ticket.dao.js";

import UserRepository from '../repository/UserRepository.js';
import ProductRepository from '../repository/ProductRepository.js';
import CartRepository from "../repository/CartRepository.js";
import TicketRepository from "../repository/TicketRepository.js";

const userDao = new Users();
const productDao = new Products();
const cartDao = new Carts();
const ticketDao = new Tickets();

export const UserService = new UserRepository(userDao);
export const ProductService = new ProductRepository(productDao);
export const CartService = new CartRepository(cartDao);
export const ticketService = new TicketRepository(ticketDao);
