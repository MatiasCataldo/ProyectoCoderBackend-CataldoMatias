import userModel from '../dao/models/user.model.js';
import passport from 'passport';
import bcrypt from "bcrypt";
import { isValidPassword, generateJWToken } from '../utils.js';

// LOGING
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email: email });
        console.log("Usuario encontrado para login:");
        console.log(user);
        if (!user) {
            console.warn("User doesn't exists with username: " + email);
            return res.status(204).send({ error: "Not found", message: "Usuario no encontrado con username: " + email });
        }
        if (!isValidPassword(user, password)) {
            console.warn("Invalid credentials for user: " + email);
            return res.status(401).send({ status: "error", error: "El usuario y la contraseña no coinciden!" });
        }
        const tokenUser = {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
            role: user.role
        };
        const access_token = generateJWToken(tokenUser);
        console.log(access_token);

        // 2do con Cookies
        res.cookie('jwtCookieToken', access_token,
            {
                maxAge: 600000,
                // httpOnly: true //No se expone la cookie
                 httpOnly: false //Si se expone la cookie

            }

        )
        res.send({ message: "Login success!!" })
    } catch (error) {
        console.error(error);
        return res.status(500).send({ status: "error", error: "Error interno de la applicacion." });
    }
};

// REGISTER

export const register = async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;
        if (!first_name || !last_name || !email || !password || !age) {
            return res.status(400).json({ error: "Todos los campos son obligatorios" });
        }

        // Verificar si el usuario ya existe
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "El correo electrónico ya está registrado" });
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear un nuevo usuario
        const newUser = new userModel({
            first_name,
            last_name,
            email,
            age,
            password: hashedPassword
        });

        // Guardar el nuevo usuario en la base de datos
        await newUser.save();

        // Crear un carrito para el nuevo usuario
        const newCart = new cartModel({
            user: newUser._id, // Asignar el ID del nuevo usuario al campo 'user' del carrito
            items: [] // Puedes inicializar el carrito con una lista vacía de elementos
        });

        // Guardar el carrito en la base de datos
        await newCart.save();

        // Responder con un mensaje de éxito
        res.status(201).json({ message: "Usuario registrado con éxito" });
    } catch (error) {
        console.error("Error al registrar al usuario:", error);
        res.status(500).json({ error: "Error interno del servidor al registrar al usuario" });
    }
};

// GITHUB
export const githubLogin = passport.authenticate('github', { scope: ['user:email'] });

// CALLBACK GITHUB
export const githubCallback = async (req, res) => {
    const user = req.user;
    try {
        console.log("Usuario encontrado para login:");
        console.log(user);

        const tokenUser = {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
            role: (user.email === 'adminCoder@coder.com' && user.password === 'adminCod3r123') ? 'admin' : 'user',
            age: user.age
        };

        const access_token = generateJWToken(tokenUser);

        // Se establece la cookie con el token JWT
        res.cookie('jwtCookieToken', access_token, {
            maxAge: 600000,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ status: "error", error: "Error interno de la aplicación." });
    }
    res.redirect("/home/user");
};
