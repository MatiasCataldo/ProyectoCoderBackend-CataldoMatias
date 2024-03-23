import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new Schema({
    id: { type: String, required: true },
    title: { type: String, required: true, index: true, },
    description: { type: String, required: true },
    price: { type: Number, required: true, index: true, },
    thumbnail: { type: String, required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true, index: true },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }
});

productSchema.plugin(mongoosePaginate);
const productModel = model('products', productSchema);

export default productModel;
