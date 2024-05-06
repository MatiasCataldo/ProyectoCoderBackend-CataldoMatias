import { Router } from "express";
import {  getUsers, deleteUser, deleteInactiveUsers, getUserById, getUserByEmail, changeUserRole, uploadDocuments } from '../controllers/user.controller.js';
import { upload, passportCall, authorization } from "../utils.js"

const router = Router();

router.get("/", getUsers);

router.delete("/:userId/deleteUser", deleteUser);

router.delete('/',  passportCall('jwt'), authorization('admin'), deleteInactiveUsers);

router.get("/:userId", getUserById);

router.get("/email/:email", getUserByEmail);

router.put('/premium/:userId', changeUserRole);

router.post("/:uid/documents", upload.fields([{ name: 'documents' }, { name: 'imgProfile' }, { name: 'imgProduct' }]), uploadDocuments);

export default router;
