import { Router } from "express";
import { getAllMessages, createMessage } from "../controllers/messages.controller.js";

const router = Router();

router.get("/chat", getAllMessages);

router.post("/", createMessage);

export default router;
