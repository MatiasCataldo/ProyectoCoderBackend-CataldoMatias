import ProductModel from "./src/dao/models/product.model.js"

export class ProductManager {
    async addProduct(productData) {
        try {
            const product = new ProductModel(productData);
            await product.save();
            console.log('Producto añadido:', product);
        } catch (error) {
            console.error('Error al añadir el producto:', error);
        }
    }

    async getProducts() {
        try {
            const response = await fetch('http://localhost:8080/mockingproducts', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                const productos = await response.json();
                return productos;
            } else {
                console.error('Error al cargar los productos:', response.statusText);
                return [];
            }
        } catch (error) {
            console.error('Error al obtener los productos:', error);
            return [];
        }
    }
    

    async getProductById(idProduct) {
        try {
            const product = await ProductModel.findById(idProduct);
            console.log('Producto obtenido por ID:', product);
            return product;
        } catch (error) {
            console.error('Error al obtener el producto por ID:', error);
            return null;
        }
    }

    async updateProduct(idProduct, updatedProduct) {
        try {
            const product = await ProductModel.findByIdAndUpdate(idProduct, updatedProduct, { new: true });
            console.log('Producto actualizado:', product);
            return product;
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
            return null;
        }
    }

    async deleteProduct(idProduct) {
        try {
            const product = await ProductModel.findByIdAndDelete(idProduct);
            console.log('Producto eliminado:', product);
            return product;
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            return null;
        }
    }
}

export class CartManager{
    async getCartItems(token, userId) {
        const userToken = token.toString();
        const userString = userId.toString();
        
        try {
            const response = await fetch(`http://localhost:8080/api/carts/${userString}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const cartItems = await response.json();
                return cartItems;
            } else {
                console.error('Error al obtener los productos del carrito del backend:', response.statusText);
                return null;
            }
        } catch (error) {
            console.error('Error de red al obtener el carrito:', error);
            return null;
        }
    }
}

export class UserManager{
    async getUsers(token) {
        try {
            const response = await fetch('http://localhost:8080/api/users', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const users = await response.json();
                return users; 
            } else {
                console.error('Error al cargar los usuarios:', response.statusText);
                return {};
            }
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
            return [];
        }
    }
}
