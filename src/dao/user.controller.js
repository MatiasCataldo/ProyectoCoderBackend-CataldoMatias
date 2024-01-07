import userDao from './user.dao.js';

class UserController {
    async newUser(username) {
        try {
            const user = await userDao.createUser( username);
            await userDao.createNewCart(user._id);
            res.status(201).json({
                status: 'success',
                user,
                message: 'Usuario creado!',
            });
        } catch (error) {
            console.error('Error al crear el primer usuario2:', error);
            res.status(500).json({ error, message: 'Error al crear el primer usuario2.' });
        }
    }

    async getUserId(req, res) {
        try {
            const { userId } = req.body;
            console.log('req.body:', req.body); 
            const user = await userDao.getUserById(userId);
            res.status(200).json({
                status: 'success',
                user,
                message: 'ID del usuario obtenido!',
            });
        } catch (error) {
            console.error('Error al obtener usuario por ID:', error);
            res.status(500).json({ error, message: 'Error al obtener usuario por ID.' });
        }
    }
}

export default new UserController();