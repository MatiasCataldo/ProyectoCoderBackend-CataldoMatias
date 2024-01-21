import { Schema, model } from "mongoose";

const userSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: {
    type: String,
    unique: true
  },
  age: {type: Number},
  password: {type: String},
  loggedBy: {type: String},
  cart: { type: Schema.Types.ObjectId, ref: "Cart" }
});

const userModel = model('User', userSchema);

export default userModel;
