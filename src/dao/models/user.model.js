import { Schema, model } from "mongoose";

const userSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true ,unique: true },
  age: {type: Number},
  password: {type: String},
  loggedBy: {type: String},
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'admin', 'premium'],
  },
  cartId: { type: Schema.Types.ObjectId, ref: "Cart" },
  documents: [{
    name: String,
    reference: String
  }],
  status: { type: String, default: 'offline' }, 
  last_connection: { 
    type: Date, 
    default: null 
  }
});

const userModel = model('User', userSchema);

export default userModel;
