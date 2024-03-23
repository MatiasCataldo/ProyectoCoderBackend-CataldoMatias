import { Router } from 'express';
import passport from 'passport';
import { login, register, githubLogin, githubCallback } from '../controllers/jwt.controller.js';

const router = Router();

router.post("/login", login);

router.post('/register', passport.authenticate('register', { session: false }), register);

router.get("/github", passport.authenticate('github', { scope: ['user:email'] }), githubLogin);

router.get("/githubcallback", passport.authenticate('github', { session: false, failureRedirect: '/github/error' }), githubCallback);

export default router;
