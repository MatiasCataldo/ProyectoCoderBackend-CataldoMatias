import messageDao from "../dao/message.dao.js";

// OBTENER TODOS LOS MENSAJES
export const getAllMessages = async (req, res) => {
    try {
        const messages = await messageDao.getAllMessages();
        res.json({
            data: messages,
            message: "Messages list",
        });
    } catch (error) {
        res.json({
            error,
            message: "Error",
        });
    }
};

// NUEVO MENSAJE
export const createMessage = async (req, res) => {
    try {
        const { user, message } = req.body;
        const newMessage = await messageDao.createMessage(user, message);
        res.json({
            message: "Message created",
            data: newMessage,
        });
    } catch (error) {
        res.json({
            error,
            message: "Error",
        });
    }
};
