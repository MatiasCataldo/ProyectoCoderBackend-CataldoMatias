export const generateCartErrorInfo = (productId, quantity) => {
    return `Una o más propiedades del producto son inválidas o faltan:
        Lista de propiedades requeridas:
            -> protucId: tipo String, recibido: ${productId}
            -> quantity: tipo Number, recibido: ${quantity}
    `;
};
