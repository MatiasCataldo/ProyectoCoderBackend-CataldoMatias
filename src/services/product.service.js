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

export const deleteServices = async (id) => {
    try {
        const productos = await productDao.getProductById();
        const productoExistente = productos.find(producto => producto.id === id);
        if (!productoExistente) {
            throw new Error('El producto no existe');
        }
        return await productDao.deleteProduct(id);
    } catch (error) {
        console.error('Error al eliminar dato:', error);
        throw new Error('Error al eliminar dato');
    }
};
