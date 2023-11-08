const fs = require("fs");

class ProductManager{
    constructor(){
        this.path = "./productos.txt";
        this.loadProductsFromFile();
    }

    createFileIfNotExists(){
        if(!fs.existsSync(this.path)){
            fs.writeFileSync(this.path, "[]", "utf8");
        }
    }

    loadProductsFromFile(){
        this.createFileIfNotExists();
        const data = fs.readFileSync(this.path, "utf8");
        if(data){
            this.products = JSON.parse(data);
            this.nextProductId = this.products.length + 1;
        } else{
            this.products = [];
            this.nextProductId = 1;
        }
    }

    addProduct(product) {
        if(Object.values(product).some(value => value === "")){
            console.error("Error al cargar producto! Campos incompletos");
        } else{
            product.code = this.nextProductId++;
            this.products.push(product);
            fs.writeFileSync(this.path, JSON.stringify(this.products), "utf8");
        }
    }

    getProducts(){
        const data = fs.readFileSync(this.path, "utf8");
        if(data){
            const products = JSON.parse(data);
            return products;
        } else{
            return [];
        }
    }

    getProductById(idProduct){
        const data = fs.readFileSync(this.path, "utf8");
        if(data){
            const products = JSON.parse(data);
            const existsProduct = products.find((product) => product.code === idProduct);
            if(existsProduct){
                return existsProduct;
            } else{
                console.log("No Encontrado.");
            }
        } else{
            console.log("No Encontrado.");
        }
    }

    updateProduct(idProduct, updatedProduct){
        const productToUpdate = this.getProductById(idProduct);
        if(productToUpdate){
            Object.assign(productToUpdate, updatedProduct);
            const data = fs.readFileSync(this.path, "utf8");
            const products = JSON.parse(data);
            products.forEach((product, index) => {
                if(product.code === idProduct){
                    products[index] = productToUpdate;
                }
            });
            fs.writeFileSync(this.path, JSON.stringify(products), "utf8");
            console.log(`Producto ${idProduct} actualizado.`);
        } else{
            console.log("Producto no encontrado. No se pudo actualizar.");
        }
    }

    deleteProduct(idProduct){
        const productToDelete = this.getProductById(idProduct);
        if(productToDelete){
            const index = this.products.indexOf(productToDelete);
            if(index !== -1){
                this.products.splice(index, 1);
                console.log(`Producto ${idProduct} eliminado.`);
                fs.writeFileSync(this.path, JSON.stringify(this.products), "utf8");
            }
        } else{
            console.log("Producto no encontrado. No se pudo eliminar.");
        }
    }
}

class Product{
    constructor(title, 
        description, 
        price, 
        thumbnail, 
        stock) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.stock = stock;
        this.code = null;
    }
}

// Pruebas
const manejadorProductos = new ProductManager();

// PRODUCTO 1:
console.log("agregando Producto1: TITLE:'Helado Artesanal de 1/4Kg', DESCRIPTION:'Helado artesanal de 1/4 de kilo con 3 sabores a elegir.', PRICE'1600', URL:'...', ID:'1', STOCK:'50'");

manejadorProductos.addProduct(new Product("Helado Artesanal de 1/4Kg", "Helado artesanal de 1/4 de kilo con 3 sabores a elegir.", 1600, "url", 0, 50));

// PRODUCTO 2:
console.log("agregando Producto2: TITLE:'Helado Artesanal de 1/2Kg', DESCRIPTION:'Helado artesanal de 1/2 de kilo con 3 sabores a elegir.', PRICE'2900', URL:'...', ID:'1', STOCK:'50'");

manejadorProductos.addProduct(new Product("Helado Artesanal de 1/2Kg", "Helado artesanal de 1/2 de kilo con 3 sabores a elegir.", 2900, "url", 0, 50));

// PRODUCTO 3:
console.log("agregando Producto3: TITLE:'Helado Artesanal de 1Kg', DESCRIPTION:'Helado artesanal de 1 kilo con 4 sabores a elegir.', PRICE'4800', URL:'...', ID:'1', STOCK:'50'");

manejadorProductos.addProduct(new Product("Helado Artesanal de 1Kg", "Helado artesanal de 1 kilo con 4 sabores a elegir.", 4800, "url", 0, 50));

// PRODUCTO 4 INCOMPLETO:
console.log("agregando Producto4: TITLE:'', DESCRIPTION:'Helado artesanal de 1 kilo con 4 sabores a elegir.', PRICE'4800', URL:'...', ID:'1', STOCK:'50'");

manejadorProductos.addProduct(new Product("", "Helado artesanal de 1 kilo con 4 sabores a elegir.", 4800, "url", 0, 50));

console.log(manejadorProductos.getProducts());
