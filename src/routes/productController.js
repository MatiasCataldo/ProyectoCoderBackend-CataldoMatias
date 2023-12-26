import productDao from '../dao/product.dao.js';

class ProductController {
    async getAllProducts(req, res) {
        try {
            const { page = 1, limit = 10, sort, query } = req.query;

            const skip = (page - 1) * limit;
            const filter = query ? { category: query } : {};
            const products = await productDao.getAllProducts({ skip, limit, sort, filter });

            const totalProducts = await productDao.countProducts(filter);
            const totalPages = Math.ceil(totalProducts / limit);
            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;

            const prevLink = hasPrevPage ? `/products?page=${page - 1}&limit=${limit}` : null;
            const nextLink = hasNextPage ? `/products?page=${page + 1}&limit=${limit}` : null;

            res.json({
                status: 'success',
                payload: products,
                totalPages,
                prevPage: page - 1,
                nextPage: page + 1,
                page: +page,
                hasPrevPage,
                hasNextPage,
                prevLink,
                nextLink,
            });
        } catch (error) {
            console.log(error);
            res.json({
                status: 'error',
                error,
                message: 'Error',
            });
        }
    }
}

export default new ProductController();
