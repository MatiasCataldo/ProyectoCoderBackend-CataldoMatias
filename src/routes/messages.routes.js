import { Router } from "express";
import messageDao from "../dao/message.dao.js";

const router = Router();

router.get("/chat", async (req, res) => {
    try {
        const messages = await messageDao.getAllMessages();
        res.json({
            data: messages,
            message: "Messages list",
        });
    } catch (error) {
        console.log(error);
        res.json({
            error,
            message: "Error",
        });
    }
});

router.post("/", async (req, res) => {
    try {
        const { user, message } = req.body;
        const newMessage = await messageDao.createMessage(user, message);
        res.json({
            message: "Message created",
            data: newMessage,
        });
    } catch (error) {
        console.log(error);
        res.json({
            error,
            message: "Error",
        });
    }
});

export default router;
