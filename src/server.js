import express from "express";
import ProductManager from "../main.js";

const app = express();
const PORT = 8080;

const manejadorProductos = new ProductManager();

app.get("/", (req, res) => {
    res.send("<h1>Hola Mundo desde express</>");
});

app.get("/products", async (req, res) => {
    try {
        const { limit } = req.query;
        const products = await manejadorProductos.getProducts();
        const limitedProducts = limit ? products.slice(0, +limit) : products;
        res.json({ products: limitedProducts });
    } catch (error) {
        res.json({ error: "Products not found" });
    }
    
});

app.get("/products/:code", async (req, res) => {
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

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
