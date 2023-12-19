import MessageModel from './models/message.model.js';

class MessageDao {
    async getAllMessages() {
        return await MessageModel.find();
    }

    async createMessage(user, message) {
        return await MessageModel.create({ user, message });
    }
}

export default new MessageDao();
