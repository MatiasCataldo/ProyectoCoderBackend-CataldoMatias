import { Schema, model } from 'mongoose';

const messageSchema = new Schema({
  user: { type: String, required: true },
  message: { type: String, required: true },
}, { timestamps: true });

const MessageModel = model('Message', messageSchema);

export default MessageModel;