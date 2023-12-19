import { Schema, model } from "mongoose";

const productSchema = new Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    thumbnail: { type: String, required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
});

const productModel = model('products', productSchema);

export default productModel;
