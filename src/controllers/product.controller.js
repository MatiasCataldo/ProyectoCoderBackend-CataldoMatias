import { ProductService } from '../services/service.js';
import { generateProduct } from '../utils.js';
import CustomProductError from "../services/error/CustomError.js";
import { ProductErrors } from "../services/error/errors-enum.js";
import { generateProductErrorInfo } from "../services/messages/product-creation-error.message.js";

// GUARDAR PRODUCTO
export const saveProduct = async (req, res) => {
    try {
        const { id, title, description, price, thumbnail, stock, category, owner } = req.body;
        if (!id || !title || !description || !price || !thumbnail || !stock || !category) {
            CustomProductError.createError({
                name: "Product Create Error",
                cause: generateProductErrorInfo({ id, title, description, price, thumbnail, stock, category }),
                message: "Error al intentar crear el producto",
                code: ProductErrors.MISSING_REQUIRED_FIELDS
            });
        }

        let ownerToSet;
        if (!owner) {
            ownerToSet = 'admin';
        }else{
            ownerToSet = req.user._id;
        }

        const productDto = {
            id,
            title,
            description,
            price,
            thumbnail,
            stock,
            category,
            owner: ownerToSet
        };
        await ProductService.create(productDto);
        res.status(201).send({ status: "success", payload: productDto });

    } catch (error) {
        console.error(error.cause);
        res.status(500).send({ error: error.code, message: error.message });
    }
};

export const getProducts = async (rq, res) => {
    try {
        let products = [];
        for (let i = 0; i < 100; i++) {
            products.push(generateProduct());
        }
        res.send({ status: "success", payload: products });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error, message: "No se pudo obtener los productos" });
    }
};

export const getDatosControllers = async (req, res) => {
    try {
        const datos = await ProductService.getAll({}).sort({ code: 1 });
        res.status(200).json(datos);
    } catch (error) {
        console.error("Error al obtener los productos:", error);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
}

export const postDatosControllers = async (req, res) => {
    let dato = req.body;
    await ProductService.createProduct(dato);
    res.json({ dato })
}

export const DeleteProduct = async (req, res) => {
    const { productId } = req.body;
    const deletedProduct = await ProductService.delete(productId);
    if (!deletedProduct) {
        res.status(404).json({ message: 'Producto no encontrado' });
    } else {
        const user = await userService.getBy(deletedProduct.owner);
        await sendProductDeletedEmail(user.email, deletedProduct.name);
        res.status(200).json({ message: 'Producto eliminado correctamente', deletedProduct });
    }
};
