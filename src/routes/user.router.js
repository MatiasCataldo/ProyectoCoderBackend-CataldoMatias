import { Router } from 'express';
import userModel from '../dao/models/user.model.js';
import { createHash, isValidPassword } from '../utils.js';
import  passport  from 'passport';

const router = Router();

router.get("/github", passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => {
    { }
})

router.get("/githubcallback", passport.authenticate('github', { failureRedirect: '/github/error' }), 
async (req, res) => {
    const user = req.user;
    req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age
    };
    req.session.admin = true;
    res.redirect("/")
})

router.post('/register', passport.authenticate('register', {
    failureRedirect: 'api/session/fail-register'
}), async (req, res) => {
    console.log("Registrando usuario:");
    res.redirect('/users/login');
})

router.post('/login', passport.authenticate('login',{failureRedirect: '/api/session/fail-login'}
), async (req, res) => {
console.log("Usuario encontrado");
const user = req.user;
console.log(user);
req.session.user = {
    name: `${user.first_name} ${user.last_name}`,
    email: user.email,
    age: user.age
}
res.send({ status: "success", payload: req.session.user, message: "¡Primer logueo realizado! :)" });
})

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

router.get("/fail-register", (req, res) => {
    res.status(401).send({ error: "Failed to process register!" });
});

router.get("/fail-login", (req, res) => {
    res.status(401).send({ error: "Failed to process login!" });
});

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Error al cerrar sesión');
        }
        res.redirect('/');
    });
});

export default router;