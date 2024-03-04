import UserModel from './models/user.model.js';

class UserDao {
    async createUser(username) {
        const user = await UserModel.create({ username });
        return user;
    }

    async getUserById(userId) {
        return await UserModel.findById(userId);
    }

    async getUserEmailById(userId) {
        try {
            const user = await UserModel.findById(userId);
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

    async createNewCart(userId) {
        const cart = await CartModel.create({ userId });
        await UserModel.findByIdAndUpdate(userId, { cart: cart._id });
        return cart;
    }

    async getUserId(username) {
        const user = await UserModel.findOne({ username });
        return user ? user._id : null;
    }
}

export default new UserDao();