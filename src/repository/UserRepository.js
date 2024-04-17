import CartModel from "../dao/models/cart.model.js";
import UserModel from "../dao/models/user.model.js";
import GenericRepository from "./GenericRepository.js";

export default class UserRepository extends GenericRepository{
    constructor(dao){
        super(dao);
    }
    
    getUserEmailById = async (userId) => {
        try {
            const user = await UserModel.findById(userId); // Aquí esperamos a que se ejecute la consulta
            if (user && user.email) {
                return user.email;
            } else {
                throw new Error('El usuario no tiene un correo electrónico definido.');
            }
        } catch (error) {
            console.error('Error al obtener el correo electrónico del usuario:', error);
            throw error;
        }
    }
    

    getBy = (id) =>{
        return UserModel.findById(id);
    }

    createNewCart = (userId) => {
        const cart = CartModel.create({ userId });
        UserModel.findByIdAndUpdate(userId, { cart: cart._id });
        return cart;
    }
    
}