import bcrypt from "bcrypt";
import {faker} from '@faker-js/faker';
import { UserService } from '../services/service.js';

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
        const users = await UserService.getAll();
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
        const user = await UserService.getBy(userId);
        if (!user) {
            return res.status(202).json({ message: "User not found with ID: " + userId });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

//OBTENER USUARIO POR EMAIL
export const getUserByEmail = async (req, res) => {
    const userEmail = req.params.email
    try {
        const user = await UserService.getByEmail(userEmail);
        if (!user) {
            return res.status(202).json({ message: "Usuario no encontrado usando email: " + userEmail });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

// ACTUALIZAR CONTRASEÑA DEL USUARIO
export const updatePassword = async (req, res) => {
    const { email, newPassword } = req.body;
    try {
        const user = await UserService.getByEmail({ email });
        if (!user) return res.status(401).json({ status: 'error', error: "Usuario no encontrado" });
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
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
        const user = await UserService.getBy(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const requiredDocuments = ['Identificación', 'Comprobante de domicilio', 'Comprobante de estado de cuenta'];
        const userDocuments = user.documents.map(doc => doc.name);
        const missingDocuments = requiredDocuments.filter(doc => !userDocuments.includes(doc));
        if (missingDocuments.length > 0) {
            return res.status(400).json({ message: `El usuario no ha terminado de procesar su documentación. ` });
        }

        if (user.role !== 'admin') {
            user.role = 'premium';
            await user.save();
            return res.status(201).json({ message: `Rol de usuario ${userId} actualizado a ${user.role}` });
        } else {
            return res.status(400).json({ message: 'No se puede actualizar el rol de un usuario administrador a premium.' });
        }
    } catch (error) {
        console.error('Error al cambiar el rol de usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};


//SUBIR ARCHIVOS
export const uploadDocuments = async (req, res) => {
    try {
        const userId = req.params.uid;
        const user = await UserService.getBy(userId);

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ message: 'No se han proporcionado archivos para cargar.' });
        }

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        const files = req.files;
        const documents = [];

        for (const key in files) {
            const filesArray = files[key];
        
            for (let i = 0; i < filesArray.length; i++) {
                const file = filesArray[i];
        
                const document = {
                    name: file.originalname,
                    reference: file.path,
                };
                
                documents.push(document);
            }
        }

        user.documents = documents;
        await user.save();

        return res.status(200).json({ message: "Documentos subidos y usuario actualizado correctamente", user });
    } catch (error) {
        console.error('Error al cargar documentos:', error);
        res.status(500).json({ message: 'Error al cargar documentos.', error: error });
    }
};


