import { Router } from 'express';
import passport from 'passport';
import { login, logout, register, githubLogin, githubCallback, googleLogin, googleCallback } from '../controllers/jwt.controller.js';

const router = Router();

router.post("/login", login);

router.post("/logout", logout);

router.post('/register', passport.authenticate('register', { session: false }), register);

router.get("/github", passport.authenticate('github', { scope: ['user:email'] }), githubLogin);

router.get("/githubcallback", passport.authenticate('github', { session: false, failureRedirect: '/github/error' }), githubCallback);

router.get("/google", passport.authenticate('google', { scope: ['profile', 'email'] }), googleLogin);

router.get("/auth/google/callback", passport.authenticate('google', { failureRedirect: '/login' }), googleCallback);

export default router;
