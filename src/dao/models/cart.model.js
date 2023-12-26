import { Schema, model } from "mongoose";

const cartItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, default: 0 },
});

const cartSchema = new Schema({
  userId: { type: String, required: true },
  items: [cartItemSchema],
});

const cartModel = model('Cart', cartSchema);

export default cartModel;
