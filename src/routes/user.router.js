import { Router } from "express";
import { fakeUser, getUsers, getUserById, updatePassword, changeUserRole } from '../controllers/user.controller.js';

const router = Router();

router.get("/test", fakeUser);

router.get("/", getUsers);

router.get("/:userId", getUserById);

router.put('/premium/:userId', changeUserRole);

export default router;
