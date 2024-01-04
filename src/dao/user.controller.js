import userDao from './user.dao.js';

class UserController {
    async newUser(req, res) {
        try {
            const { username } = req.body;
            const user = await userDao.createUser(username);
            await userDao.createNewCart(user._id);
            res.json({
                status: 'success',
                user,
                message: 'Usuario creado!',
            });
        } catch (error) {
            console.log(error);
            res.json({
                status: 'error',
                error,
                message: 'Error al crear usuario!',
            });
        }
    }

    async getUserId(req, res) {
        try {
            const { username } = req.params;
            const userId = await userDao.getUserId(username);
            res.json({
                status: 'success',
                userId,
                message: 'ID del usuario obtenido!',
            });
        } catch (error) {
            console.log(error);
            res.json({
                status: 'error',
                error,
                message: 'Error al obtener el ID del usuario!',
            });
        }
    }
}

export default new UserController();
