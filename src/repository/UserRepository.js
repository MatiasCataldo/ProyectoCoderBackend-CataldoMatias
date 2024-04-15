import CartModel from "../dao/models/cart.model.js";
import UserModel from "../dao/models/user.model.js";
import GenericRepository from "./GenericRepository.js";

export default class UserRepository extends GenericRepository{
    constructor(dao){
        super(dao);
    }
    
    getUserByEmail = (email) =>{
        return this.getBy({email});
    }
    getUserById = (id) =>{
        return this.getBy({_id:id})
    }

    createNewCart = (userId) => {
        const cart = CartModel.create({ userId });
        UserModel.findByIdAndUpdate(userId, { cart: cart._id });
        return cart;
    }
    
}