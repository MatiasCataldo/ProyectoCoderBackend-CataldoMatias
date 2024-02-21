import express from 'express';
import { getDatosControllers, postDatosControllers, deleteDatosControllers } from '../controllers/product.controller.js';

const router = express.Router();

// GET
router.get('/', getDatosControllers);

// POST
router.post('/', postDatosControllers);

// DELETE
router.delete('/', deleteDatosControllers);

export default router;
