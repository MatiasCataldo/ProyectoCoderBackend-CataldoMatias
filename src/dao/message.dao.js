import MessageModel from './models/message.model.js';

export default class MessageDao {
    async getAllMessages() {
        return await MessageModel.find();
    }

    async createMessage(user, message) {
        return await MessageModel.create({ user, message });
    }
}
