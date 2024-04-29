import { Router } from "express";
import { getDatosControllers } from '../controllers/product.controller.js';

const router = Router();

router.get("/", getDatosControllers);

export default router;