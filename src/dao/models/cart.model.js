import { Schema, model } from "mongoose";

const cartItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: {type: String},
  productPrice: { type: Number },
  quantity: { type: Number, default: 0 },
  productImage: { type: String}
});

const cartSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  items: [cartItemSchema],
});

const cartModel = model('Cart', cartSchema);

export default cartModel;
