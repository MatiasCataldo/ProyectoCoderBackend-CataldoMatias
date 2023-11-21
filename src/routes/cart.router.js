import { Router } from 'express';
import fs from 'fs';

const router = Router();

router.get('/:cid', (req, res) => {
    try {
        const { cid } = req.params;
        const carts = getCarts();
        const cart = carts.find((cart) => cart.id === cid);
        if (cart) {
            res.json(cart.products);
        } else {
            res.json({ error: 'Cart not found' });
        }
    } catch (error) {
        res.json({ error: 'Error al obtener productos del carrito' });
    }
});

router.post('/', (req, res) => {
    try {
        const carts = getCarts();
        const newCart = {
            id: generateUniqueId(),
            products: [],
        };
        carts.push(newCart);
        saveCarts(carts);
        res.json(newCart);
    } catch (error) {
        res.json({ error: 'Error al crear el carrito' });
    }
});

router.post('/:cid/product/:pid', (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const carts = getCarts();
        const cart = carts.find((cart) => cart.id === cid);
        if (!cart) {
            res.json({ error: 'Carrito no encontrado' });
            return;
        }
        const products = cart.products;
        const existingProduct = products.find((product) => product.product === pid);
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            products.push({ product: pid, quantity });
        }
        saveCarts(carts);
        res.json({ status: 'Producto agregado al carrito' });
    } catch (error) {
        res.json({ error: 'Error al agregar producto al carrito' });
    }
});

function getCarts() {
    const data = fs.readFileSync('./carrito.json', 'utf8');
    return data ? JSON.parse(data) : [];
}

function saveCarts(carts) {
    fs.writeFileSync('./carrito.json', JSON.stringify(carts), 'utf8');
}

function generateUniqueId() {
    return (Date.now().toString(36) + Math.random().toString(36)).substring(0, 5);
}

export default router;
