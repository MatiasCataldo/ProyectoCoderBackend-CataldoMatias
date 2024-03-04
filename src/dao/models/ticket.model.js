import mongoose from 'mongoose';
import { Schema, model } from "mongoose";

const ticketSchema = new Schema({
  code: { type: String, unique: true },
  purchase_datetime: { type: Date, default: Date.now },
  amount: Number,
  purchaser: String
});

const TicketModel = model('Ticket', ticketSchema);

export default TicketModel;