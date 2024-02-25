import {ProductsModel} from "../../../dao/models/product.model.js";

export default class ProductService {
    constructor() { 
        console.log("Trabajando productos con persistencia de datos en MongoDB");
    }

    getAll = async () => {
        let products = await ProductsModel.find();
        return products.map(product=>product.toObject());
    }
    save = async (product) => {
        let result = await ProductsModel.create(product);
        return result;
    }
}