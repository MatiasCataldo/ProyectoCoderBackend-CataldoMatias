import userModel from '../dao/models/user.model.js';
import bcrypt from "bcrypt";
import {faker} from '@faker-js/faker'; 

// CREAR USUARIO TEST
export const fakeUser = async (req, res) => {
    let first_name = faker.name.firstName();
    let last_name = faker.name.lastName();
    let email = faker.internet.email();
    let age = faker.random.numeric(2);
    let password = faker.internet.password();
    res.send({first_name, last_name, email, age, password});
}

// OBTENER USUARIOS
export const getUsers = async (req, res) => {
    try {
        const users = await userModel.find();
        res.json(users);
    } catch (error) {
        console.error("Error al obtener los usuarios:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener los usuarios" });
    }
};

// OBTENER USUARIO POR ID
export const getUserById = async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(202).json({ message: "User not found with ID: " + userId });
        }
        res.json(user);
    } catch (error) {
        console.error("Error consultando el usuario con ID: " + userId);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// ACTUALIZAR CONTRASEÑA DEL USUARIO
export const updatePassword = async (req, res) => {
    const { email, newPassword } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) return res.status(401).json({ status: 'error', error: "Usuario no encontrado" });
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        console.log("Contraseña Modificada", req.session.user);
        res.json({ status: "success", payload: req.session.user, message: "Contraseña Modificada con Éxito" });
    } catch (error) {
        console.error("Error al actualizar la contraseña:", error);
        res.status(500).json({ status: 'error', error: "Error interno del servidor" });
    }
};

// CAMBIAR ROL
export const changeUserRole = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        if ( user.role === 'admin'){
            user.role = 'premium';
        }else{
            user.role = 'admin';
        }

        await user.save();
        res.json({ message: `Rol de usuario ${userId} actualizado a ${user.role}` });
    } catch (error) {
        console.error('Error al cambiar el rol de usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
