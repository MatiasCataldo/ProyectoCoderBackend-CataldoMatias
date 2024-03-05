import ProductModel from './models/product.model.js';

class ProductDao {
    async getAllProducts({ skip = 0, limit = 10, sort = {}, filter = {} }) {
        return await ProductModel.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit);
    }

    async getTotalProductsCount(filter) {
        return await ProductModel.countDocuments(filter);
    }

    async getProductById(productId) {
        return await ProductModel.findById(productId);
    }

    async createProduct(product) {
        return await ProductModel.create(product);
    }

    async updateProductStock(productId, quantity) {
        const product = await ProductModel.findById(productId);
        if (!product) {
            throw new Error('Producto no encontrado');
        }
        product.stock -= quantity;
        await product.save();
        return product;
    }

    async deleteProduct(productId) {
        return await ProductModel.findOneAndDelete({ id: productId });
    }
}

export default new ProductDao();
