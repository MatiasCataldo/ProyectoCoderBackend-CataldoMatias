import express from 'express';
import path from 'path';

const router = express.Router();

router.get('/', (req, res) => {
  res.render('home');
});

router.get('/realtimeproducts', (req, res) => {
  res.render('realtimeproducts');
});

export default router;
