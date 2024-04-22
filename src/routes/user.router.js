import { Router } from "express";
import { fakeUser, getUsers, getUserById, changeUserRole, uploadDocuments } from '../controllers/user.controller.js';
import { upload } from "../utils.js"

const router = Router();

router.get("/test", fakeUser);

router.get("/", getUsers);

router.get("/:userId", getUserById);

router.put('/premium/:userId', changeUserRole);

router.post("/:uid/documents", upload.fields([{ name: 'documents' }, { name: 'imgProfile' }, { name: 'imgProduct' }]), uploadDocuments);

export default router;
