import { Schema, model } from "mongoose";

const userSchema = new Schema({
  username: { type: String, required: true },
  cart: { type: Schema.Types.ObjectId, ref: "Cart" },
});

const userModel = model('User', userSchema);

export default userModel;
