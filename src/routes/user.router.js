import { Router } from "express";
import { fakeUser, getUsers, getUserById, updatePassword } from '../controllers/user.controller.js';

const router = Router();

router.get("/test", fakeUser);

router.get("/", getUsers);

router.get("/:userId", getUserById);

router.post('/updatePassword', updatePassword);

export default router;
