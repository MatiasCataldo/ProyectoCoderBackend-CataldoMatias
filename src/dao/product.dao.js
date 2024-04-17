import ProductModel from './models/product.model.js';

export default class ProductDao {
    get = (params) => {
        return ProductModel.find(params);
    }

    getTotalProductsCount(filter) {
        return ProductModel.countDocuments(filter);
    }

    getBy(productId) {
        return ProductModel.findById(productId);
    }

    save(product) {
        return ProductModel.create(product);
    }

    update = async (productId, quantity) => {
        const product = await ProductModel.findById(productId);
        if (!product) {
            throw new Error('Producto no encontrado');
        }
        product.stock -= quantity;
        await product.save();
        return product;
    }
    

    delete(productId) {
        return ProductModel.findByIdAndDelete(productId);
    }
}

