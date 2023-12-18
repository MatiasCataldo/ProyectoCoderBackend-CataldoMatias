import ProductModel from './models/product.model.js';

class ProductDao {
    async getAllProducts() {
        return await ProductModel.find();
    }

    async getProductById(productId) {
        return await ProductModel.findOne({ id: productId });
    }

    async createProduct(product) {
        return await ProductModel.create(product);
    }

    async updateProduct(productId, updatedProduct) {
        return await ProductModel.findOneAndUpdate({ id: productId }, updatedProduct, { new: true });
    }

    async deleteProduct(productId) {
        return await ProductModel.findOneAndDelete({ id: productId });
    }
}

export default new ProductDao();