import UserModel from './models/user.model.js';
import CartModel from './models/cart.model.js';

export default class UserDao {
    save = (doc) => {
        return UserModel.create( doc );
    }

    get = (params) => {
        return UserModel.find(params);
    }

    getBy = (userId) => {
        return UserModel.findById(userId);
    }

    createNewCart = (userId) => {
        const cart = CartModel.create({ userId });
        UserModel.findByIdAndUpdate(userId, { cart: cart._id });
        return cart;
    }

    delete = (userId) => {
        return UserModel.findByIdAndDelete(userId);
    }
}
