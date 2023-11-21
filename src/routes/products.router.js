import { Router } from 'express';
import ProductManager from '../../main.js';
import Product from '../../main.js';  

const router = Router();
const manejadorProductos = new ProductManager();

router.get("/", async (req, res) => {
    try {
        const { limit } = req.query;
        const products = await manejadorProductos.getProducts();
        const limitedProducts = limit ? products.slice(0, +limit) : products;
        res.json({ products: limitedProducts });
    } catch (error) {
        res.json({ error: "Products not found" });
    }
    
});

router.get("/:code", async (req, res) => { 
    try {
        const { code } = req.params;
        const product = await manejadorProductos.getProductById(Number(code));
        if (product) {
            res.json({ product });
        } else {
            res.json({ error: "Product not found" });
        }
    } catch (error) {
        res.json({ error: "Product not found" });
    }
});

router.post("/", (req, res) => {
    try{
        const { id,  title, description, price, thumbnail, stock, category } = req.body;
        console.log("Objeto recibido:", req.body);
        const newProduct = new Product(id, title, description, price, thumbnail, stock, category);
        manejadorProductos.addProduct(newProduct);
        res.json({
            status: "Creado",
        });
    } catch (error) {
        res.json({ error: "Error al crear producto" });
    }
});

router.put("/:code", (req, res) => {
    const { code } = req.params;
    const { id, title, description, price, thumbnail, stock, category } = req.body;
    const updatedProduct = new Product(id, title, description, price, thumbnail, stock, category);
    manejadorProductos.updateProduct(Number(code), updatedProduct);
    res.json({
        status: "Actualizado",
        product: {
            code: Number(code),
            id,
            title,
            description,
            price,
            thumbnail,
            stock,
            category
        },
    }); 
});

router.delete("/:code", (req, res) => {
    const { code } = req.params;
    const productCode = Number(code);
    manejadorProductos.deleteProduct(productCode);
    res.json({
        status: "Eliminado",
        productId: productCode,
    });
});

export default router;
