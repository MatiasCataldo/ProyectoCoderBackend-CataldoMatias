import { Schema, model } from "mongoose";

const cartItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  quantity: { type: Number, default: 0 },
});

const cartSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [cartItemSchema],
});

const cartModel = model('Cart', cartSchema);

export  { cartModel };
