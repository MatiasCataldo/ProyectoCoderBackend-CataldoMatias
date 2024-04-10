import UserModel from './models/user.model.js';

export default class UserDao {
    createUser = (doc) => {
        return UserModel.create( doc );
    }

    getUsers = (params) => {
        return UserModel.find(params);
    }

    getUserById = (userId) => {
        return UserModel.findById(userId);
    }

    getUserEmailById = (userId) => {
        try {
            const user = UserModel.findById(userId);
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

    createNewCart = (userId) => {
        const cart = CartModel.create({ userId });
        UserModel.findByIdAndUpdate(userId, { cart: cart._id });
        return cart;
    }

    getUserId = (username) => {
        const user = UserModel.findOne({ username });
        return user ? user._id : null;
    }
}
