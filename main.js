import fs from "fs";

class ProductManager{
    constructor(){
        this.path = "./productos.json";
        this.loadProductsFromFile();
    }
    
    createFileIfNotExists(){
        if(!fs.existsSync(this.path)){
            fs.writeFileSync(this.path, "[]", "utf8");
        }
    }

    nextProductCode() {
        const lastProduct = this.products[this.products.length - 1];
        return lastProduct ? lastProduct.code + 1 : 1;
    }
    

    loadProductsFromFile(){
        this.createFileIfNotExists();
        const data = fs.readFileSync(this.path, "utf8");
        if(data){
            this.products = JSON.parse(data);
            this.nextProductCode = this.nextProductCode.bind(this);
        } else {
            this.products = [];
            this.nextProductCode = this.nextProductCode.bind(this);
        }
    }

    addProduct(product) {
        if (Object.values(product).some(value => value === "")) {
            console.error("Error al cargar producto! Campos incompletos");
        } else {
            product.code = this.nextProductCode();
            this.products.push(product);
            fs.writeFileSync(this.path, JSON.stringify(this.products), "utf8");
        }
    }

    getProducts() {
        return this.products;
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

    deleteProduct(codeProduct) {
        const index = this.products.findIndex(product => product.code === codeProduct);
        if (index !== -1) {
            this.products.splice(index, 1);
            console.log(`Producto ${codeProduct} eliminado.`);
            fs.writeFileSync(this.path, JSON.stringify(this.products), "utf8");
        } else {
            console.log("Producto no encontrado. No se pudo eliminar.");
        }
    }
    
}

class Product{
    constructor(id,
        title, 
        description, 
        price, 
        thumbnail, 
        stock,
        category
) {
        this.id = id,
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.stock = stock;
        this.category = category;
        this.status = true;
    }
}


export default ProductManager

// Pruebas
const manejadorProductos = new ProductManager();

//manejadorProductos.addProduct(new Product("H14","Helado Artesanal de 1/4Kg", "Helado artesanal de 1/4 de kilo con 2 sabores a elegir.", 1600, "url", 50, "Helado", true));
//manejadorProductos.addProduct(new Product("H12", "Helado Artesanal de 1/2Kg", "Helado artesanal de 1/2 de kilo con 3 sabores a elegir.", 2900, "url", 50, "Helado", true));
//manejadorProductos.addProduct(new Product("H1", "Helado Artesanal de 1Kg", "Helado artesanal de 1 kilo con 4 sabores a elegir.", 4800, "url", 50, "Helado", true));
//manejadorProductos.addProduct(new Product("F1", "Frambuesas Huapis", "Frambuesas bañadas en chocolate Huapis 150gr.", 2200, "url", 50, "Bombones/Tortas", true));
//manejadorProductos.addProduct(new Product("BT1", "Torta Helada Chocotorta", "Base de pionono rellena de dulce de leche, galletitas y helado de chocotorta. Decorada con una fina capa de dulce de leche y galletitas. 2.5kg aprox.", 10500, "url", 50, "Bombones/Tortas", true));
//manejadorProductos.addProduct(new Product("BT2", "Torta Helada Oreo", "Base de pionono, con helado artesanal de crema oreo, veteado de chocolate, crema y galletitas oreo.", 10500, "url", 50, "Bombones/Tortas", true));
//manejadorProductos.addProduct(new Product("BT3", "Barra Patagónica", "Base de pionono con helado de frutos rojos y mascarpone, corazón de frutos del bosque y veteado de frutos del bosque. Crema cereza y frambuesa.", 8900, "url", 50, "Bombones/Tortas", true));
//manejadorProductos.addProduct(new Product("BT4", "Bombon Escoces", "Helado Artesanal de chocolate y crema americana, con corazón de dulce de leche repostero, cubierto con baño de repostería.", 5800, "url", 50, "Bombones/Tortas", true));

//console.log(manejadorProductos.getProducts());
