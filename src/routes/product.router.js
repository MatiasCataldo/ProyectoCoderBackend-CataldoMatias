import { Router } from "express";
import productDao from "../dao/product.dao.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const products = await productDao.getAllProducts();
    res.json({
      data: products,
      message: "Products list",
    });
  } catch (error) {
    console.log(error);
    res.json({
      error,
      message: "Error",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productDao.getProductById(id);
    if (!product) return res.json({ message: "Product not found" });
    res.json({
      product,
      message: "Product found",
    });
  } catch (error) {
    console.log(error);
    res.json({
      error,
      message: "Error",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const product = await productDao.createProduct(req.body);
    res.json({
      product,
      message: "Product created",
    });
  } catch (error) {
    console.log(error);
    res.json({
      error,
      message: "Error",
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await productDao.updateProduct(id, req.body);
    const product = await productDao.getProductById(id);
    res.json({
      product,
      message: "Product updated",
    });
  } catch (error) {
    console.log(error);
    res.json({
      error,
      message: "Error",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productDao.deleteProduct(id);
    res.json({
      product,
      message: "Product deleted",
    });
  } catch (error) {
    console.log(error);
    res.json({
      error,
      message: "Error",
    });
  }
});

export default router;
