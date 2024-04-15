import userDao from './user.dao.js';

export default class UserController {
    async newUser(username) {
        try {
            const user = await userDao.createUser( username);
            await userDao.createNewCart(user._id);
        } catch (error) {
            console.error('Error al crear el primer usuario2:', error);
        }
    }

    async getUserId(userId) {
        try {
            const user = await userDao.getUserById(userId);
        } catch (error) {
            console.error('Error al obtener usuario por ID:', error);
        }
    }
}
