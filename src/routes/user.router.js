import { Router } from "express";
import { authToken } from '../utils.js';
import { getUserById, updatePassword } from '../controllers/user.controller.js';

const router = Router();

router.get("/:userId", authToken, getUserById);

router.post('/updatePassword', updatePassword);

export default router;
