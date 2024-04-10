import productDao from '../dao/product.dao.js';

export const obtenerDatos = async () => {
    try {
        const productos = await productDao.getAllProducts();
        productos.forEach(producto => {
            if (producto.stock < 0) {
                producto.stock = 0;
            }
        });
        return productos;
    } catch (error) {
        console.error('Error al obtener datos:', error);
        throw new Error('Error al obtener datos');
    }
};

export const crearDato = async (dato) => {
    try {
        const productos = await productDao.getAllProducts();
        const existeProducto = productos.some(producto => producto.nombre === dato.nombre);
        if (existeProducto) {
            throw new Error('El producto ya existe');
        }
        dato.id = Math.random();
        await productDao.createProduct(dato);
        return dato;
    } catch (error) {
        console.error('Error al crear dato:', error);
        throw new Error('Error al crear dato');
    }
};

export const deleteProduct = async (productId, user) => {
    try {
        const product = await productDao.getProductById(productId);
        if (!product) {
            return { status: 404, message: 'Producto no encontrado' };
        }
        
        if (user.role !== 'premium' || product.owner !== user._id) {
            return { status: 403, message: 'No tienes permiso para eliminar este producto' };
        }

        await productDao.deleteProduct(productId);
        return { status: 200, message: 'Producto eliminado correctamente' };
    } catch (error) {
        return { status: 500, message: error.message };
    }
};
