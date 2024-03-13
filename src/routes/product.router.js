import express from 'express';
import { saveProduct, getDatosControllers, deleteDatosControllers } from '../controllers/product.controller.js';
import errorHandler from '../services/middlewares/index.js';

const router = express.Router();

router.get('/', getDatosControllers);

router.post("/", saveProduct);

router.delete('/', deleteDatosControllers);

router.use(errorHandler);

export default router;
