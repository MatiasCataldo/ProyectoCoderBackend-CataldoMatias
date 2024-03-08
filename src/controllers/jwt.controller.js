import userModel from '../dao/models/user.model.js';
import passport from 'passport';
import { isValidPassword, generateJWToken } from '../utils.js';

// LOGING
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email: email });
        console.log("Usuario encontrado para login: (jwt.controller)");
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
        console.log("Access_token:", access_token);

        // 2do con Cookies
        res.cookie('jwtCookieToken', access_token,
            {
                maxAge: 60000,
                // httpOnly: true //No se expone la cookie
                // httpOnly: false //Si se expone la cookie

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
    console.log("Registrando usuario...");
    res.redirect("/login");
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
            maxAge: 60000,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ status: "error", error: "Error interno de la aplicación." });
    }
    res.redirect("/home/user");
};
