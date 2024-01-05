import { Router } from 'express';
import UserController from '../dao/user.controller.js';

const router = Router();

router.post('/createFirstUser', async (req, res) => {
    try {
        const { userId, username } = req.body;
        const existingUser = await UserController.getUserId(userId);
        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya existe.' });
        }
        const newUser = await UserController.newUser({ userId, username });
        res.status(201).json({ user: newUser, message: 'Primer usuario creado exitosamente.' });
    } catch (error) {
        console.error('Error al crear el primer usuario:', error);
        res.status(500).json({ error, message: 'Error al crear el primer usuario.' });
    }
});


export default router;
