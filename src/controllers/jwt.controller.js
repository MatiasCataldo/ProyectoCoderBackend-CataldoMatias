import passport from 'passport';
import { isValidPassword, generateJWToken } from '../utils.js';
import { UserService } from '../services/service.js';


// LOGING
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserService.getByEmail(email);
        if (!user) {
            return res.status(204).send({ error: "Not found", message: "Usuario no encontrado con username: " + email });
        }
        if (!isValidPassword(user, password)) {
            return res.status(401).send({ status: "error", error: "El usuario y la contraseña no coinciden!" });
        }
        const tokenUser = {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
            role: user.role
        };
        const access_token = generateJWToken(tokenUser);

        user.status = 'online';
        user.last_connection  = null;

        await user.save();

        res.cookie('jwtCookieToken', access_token,
            {
                maxAge: 3600000,
                httpOnly: false
            });

        res.cookie('email', user.email, {
            maxAge: 3600000,
            httpOnly: false 
        });
            
        res.status(200).json({ message: "Login success!!" });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ status: "error", error: "Error interno de la applicacion." });
    }
};

//LOGOUT
export const logout = async (req, res) => {
    const userEmail = req.cookies.email;

    try {
        const user = await UserService.getByEmail(userEmail);

        if (!user) {
            return res.status(404).json({ status: "error", error: "Usuario no encontrado." });
        }

        user.status = 'offline';
        user.last_connection = new Date().toLocaleString();
        await user.save();

        res.clearCookie("jwtCookieToken");
        res.clearCookie("email")
        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error("Error logging out user:", error);
        return res.status(500).json({ status: "error", error: "Internal server error" });
    }
};

// REGISTER
export const register = async (req, res) => {
    res.status(201).send({ status: "success", message: "Usuario creado con extito." });
};

// GOOGLE LOGIN
export const googleLogin = passport.authenticate('google', { scope: ['profile', 'email'] });

// GOOGLE CALLBACK
export const googleCallback = async (req, res) => {
    const user = req.user;
    try {        
        // Si el usuario existe, genera el token JWT
        const tokenUser = {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
            role: (user.email === 'adminCoder@coder.com' && user.password === 'adminCod3r123') ? 'admin' : 'user',
            age: user.age
        };
        const access_token = generateJWToken(tokenUser);

        // Establece la cookie con el token JWT
        res.cookie('jwtCookieToken', access_token, {
            maxAge: 6000,
        });

        // Redirige al usuario a la página de inicio después de iniciar sesión
        res.redirect("/home/user");
    } catch (error) {
        console.error(error);
        return res.status(500).send({ status: "error", error: "Error interno de la aplicación." });
    }
};


// GITHUB
export const githubLogin = passport.authenticate('github', { scope: ['user:email'] });

// CALLBACK GITHUB
export const githubCallback = async (req, res) => {
    const user = req.user;
    try {
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
