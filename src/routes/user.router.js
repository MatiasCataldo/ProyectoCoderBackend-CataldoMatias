import { Router } from "express";
import { fakeUser, getUsers, getUserById, changeUserRole, uploadDocuments } from '../controllers/user.controller.js';

const router = Router();

router.get("/test", fakeUser);

router.get("/", getUsers);

router.get("/:userId", getUserById);

router.put('/premium/:userId', changeUserRole);

//router.post('/:uid/documents', uploadFiles());

router.post("/:uid/documents", uploadDocuments)

export default router;
