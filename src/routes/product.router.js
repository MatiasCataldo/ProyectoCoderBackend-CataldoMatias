import { Router } from "express";
import productDao from "../dao/product.dao.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    // Obtener parámetros de consulta
    const { limit = 10, page = 1, sort, query } = req.query;

    // Lógica para búsqueda, paginación y ordenamiento
    const skip = (page - 1) * limit;
    const sortOption = sort ? { price: sort === 'asc' ? 1 : -1 } : {};

    const filter = query ? { category: query } : {};
    const products = await productDao.getAllProducts({ skip, limit, sort: sortOption, filter });

    // Construir la respuesta
    const response = {
      data: products,
      message: "Products list",
      pageInfo: {
        totalPages: Math.ceil(products.length / limit),
        prevPage: page > 1 ? page - 1 : null,
        nextPage: page < totalPages ? page + 1 : null,
        page: Number(page),
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages,
        prevLink: page > 1 ? `/api/products?page=${page - 1}` : null,
        nextLink: page < totalPages ? `/api/products?page=${page + 1}` : null,
      },
    };
    res.json(response);
    } catch (error) {
      console.log(error);
      res.json({
        error,
        message: "Error",
      });
    }
  });

  router.get("/search", async (req, res) => {
    try {
      const { limit = 10, page = 1, sort, category, availability } = req.query;
      const skip = (page - 1) * limit;
      const sortOption = sort ? { price: sort === 'asc' ? 1 : -1 } : {};
      const filter = {};
      if (category) filter.category = category;
      if (availability) filter.availability = availability;
  
      const products = await productDao.getAllProducts({ skip, limit, sort: sortOption, filter });
      const response = {
        data: products,
        message: "Products list",
        pageInfo: {
          totalPages: Math.ceil(products.length / limit),
          prevPage: page > 1 ? page - 1 : null,
          nextPage: page < totalPages ? page + 1 : null,
          page: Number(page),
          hasPrevPage: page > 1,
          hasNextPage: page < totalPages,
          prevLink: page > 1 ? `/api/products/search?page=${page - 1}` : null,
          nextLink: page < totalPages ? `/api/products/search?page=${page + 1}` : null,
        },
      };
      res.json(response);
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
