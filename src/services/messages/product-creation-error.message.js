export const generateProductErrorInfo = (product) => {
    return `Una o más propiedades del producto son inválidas o faltan:
        Lista de propiedades requeridas:
            -> id: tipo String, recibido: ${product.id}
            -> title: tipo String, recibido: ${product.title}
            -> description: tipo String, recibido: ${product.description}
            -> price: tipo Number, recibido: ${product.price}
            -> thumbnail: tipo String, recibido: ${product.thumbnail}
            -> stock: tipo Number, recibido: ${product.stock}
            > category: tipo String, recibido: ${product.stock}
    `;
};
