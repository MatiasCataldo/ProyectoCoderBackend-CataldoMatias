import { Router } from 'express';
import userModel from '../dao/models/user.model.js';

const router = Router();

router.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;
    console.log("Registrando usuario:");
    console.log(req.body);
    const exist = await userModel.findOne({ email });
    if (exist) {
        return res.status(400).send({ status: 'error', message: "Usuario ya existe!" })
    }
    const user = {
        first_name,
        last_name,
        email,
        age,
        password
    }
    const result = await userModel.create(user);
    res.send({ status: "success", message: "Usuario creado con extito con ID: " + result.id });
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email, password });
    if (!user) return res.status(401).send({ status: 'error', error: "Campos Incorrectos" });
    req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age,
        role: (user.email === 'adminCoder@coder.com' && user.password === 'adminCod3r123') ? 'admin' : 'usuario'
    };
    console.log("Sesión del usuario después del inicio de sesión:", req.session.user);
    res.send({ status: "success", payload: req.session.user, message: "¡Primer logueo realizado! :)" });
});

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Error al cerrar sesión');
        }
        res.redirect('/users/login');
    });
});

export default router;