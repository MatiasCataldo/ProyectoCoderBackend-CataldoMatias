import { Router } from "express";
import userModel from '../dao/models/user.model.js';
import {authToken} from '../utils.js';


const router = Router();

router.get("/:userId", authToken,
async (req, res) =>{
    const userId = req.params.userId;
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            res.status(202).json({message: "User not found with ID: " + userId});
        }
        res.json(user);
    } catch (error) {
        console.error("Error consultando el usuario con ID: " + userId);
    }
});

router.post('/updatePassword', async (req, res) => {
    const { email, newPassword } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) return res.status(401).send({ status: 'error', error: "Usuario no encontrado" });
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        console.log("Contraseña Modificada", req.session.user);
        res.send({ status: "success", payload: req.session.user, message: "Contraseña Modificada con Éxito" });
    } catch (error) {
        console.error("Error al actualizar la contraseña:", error);
        res.status(500).send({ status: 'error', error: "Error interno del servidor" });
    }
});

export default router;