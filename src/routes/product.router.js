import express from 'express';
import { saveProduct, getDatosControllers, DeleteProduct } from '../controllers/product.controller.js';
import errorHandler from '../services/middlewares/index.js';

const router = express.Router();

router.get('/', getDatosControllers);

router.post("/", saveProduct);

router.delete('/', DeleteProduct);

router.use(errorHandler);

export default router;
