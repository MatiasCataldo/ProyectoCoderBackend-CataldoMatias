import { obtenerDatos, crearDato, deleteServices } from '../services/products.services.js'
import { generateProduct } from '../utils.js';
import CustomProductError from "../services/error/CustomError.js";
import { ProductErrors } from "../services/error/errors-enum.js";
import { generateProductErrorInfo } from "../services/messages/product-creation-error.message.js";

// GUARDAR PRODUCTO
export const saveProduct = (req, res) => {
    try {
        console.log(req.body);
        const { id, title, description, price, thumbnail, stock, category } = req.body;

        if (!id || !title || !description || !price || !thumbnail || !stock || !category) {
            CustomProductError.createError({
                name: "Product Create Error",
                cause: generateProductErrorInfo({ id, title, description, price, thumbnail, stock, category }),
                message: "Error al intentar crear el producto",
                code: ProductErrors.MISSING_REQUIRED_FIELDS
            });
        }

        // Lógica para guardar el producto (aquí puedes conectar con la base de datos u otro sistema de almacenamiento)
        const productDto = {
            id,
            title,
            description,
            price,
            thumbnail,
            stock,
            category
        };
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
    let datos = await obtenerDatos();
    res.json(datos);
}

export const postDatosControllers = async (req, res) => {
    let dato = req.body;
    await crearDato(dato);
    res.json({ dato })
}

export const deleteDatosControllers = async (req, res) => {
    let { id } = req.params;
    await deleteServices(id);
    res.json({ msj: "delete product" })
}