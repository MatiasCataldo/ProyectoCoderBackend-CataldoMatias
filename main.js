class ProductManager{

    constructor(){
        this.products = []        
    }

    addProduct(product){
        if(this.products.length == 0){
            product.code = 1;
        } else{
            product.code = this.products[this.products.length - 1].code + 1;
        }
        if(Object.values(product).includes("")){
            console.error("Error al cargar producto! Campos incompletos");
        } else{
            this.products.push(product);
        }
    }

    getProducts(){
        return this.products;
    }

    getProductById(idProduct){    
        const existsProduct = this.products.find((product) => product.code === idProduct);
        if(existsProduct){
            return existsProduct;
        } else{
            console.log("Not Found.");
        }
    }
}

class Product{
    constructor(
        title, 
        description, 
        price, 
        thumbnail, 
        code, 
        stock
        ){
        this.title = title || "";
        this.description = description || "";
        this.price = price || "";
        this.thumbnail = thumbnail || "";
        this.code = code || "";
        this.stock = stock || "";
    }
} 

//Pruebas
const manejadorProductos = new ProductManager();

//PRODUCTO 1:
console.log(
    "agregando Producto1: TITLE:'Helado Artesanal de 1/4Kg', DESCRIPTION:'Helado artesanal de 1/4 de kilo con 3 sabores a elegir.', PRICE'1600', URL:'...', ID:'1', STOCK:'50'"
);

manejadorProductos.addProduct(
    new Product("Helado Artesanal de 1/4Kg", "Helado artesanal de 1/4 de kilo con 3 sabores a elegir.", 1600, "url", 0, 50)
);

//PRODUCTO 2:
console.log(
    "agregando Producto2: TITLE:'Helado Artesanal de 1/2Kg', DESCRIPTION:'Helado artesanal de 1/2 de kilo con 3 sabores a elegir.', PRICE'2900', URL:'...', ID:'1', STOCK:'50'"
);

manejadorProductos.addProduct(
    new Product("Helado Artesanal de 1/2Kg", "Helado artesanal de 1/2 de kilo con 3 sabores a elegir.", 2900, "url", 0, 50)
);

//PRODUCTO 3:
console.log(
    "agregando Producto3: TITLE:'Helado Artesanal de 1Kg', DESCRIPTION:'Helado artesanal de 1 kilo con 4 sabores a elegir.', PRICE'4800', URL:'...', ID:'1', STOCK:'50'"
);

manejadorProductos.addProduct(
    new Product("Helado Artesanal de 1Kg", "Helado artesanal de 1 kilo con 4 sabores a elegir.", 4800, "url", 0, 50)
);

//PRODUCTO 4 INCOMPLETO:
console.log(
    "agregando Producto4: TITLE:'', DESCRIPTION:'Helado artesanal de 1 kilo con 4 sabores a elegir.', PRICE'4800', URL:'...', ID:'1', STOCK:'50'"
);

manejadorProductos.addProduct(
    new Product("", "Helado artesanal de 1 kilo con 4 sabores a elegir.", 4800, "url", 0, 50)
);

console.log(manejadorProductos.getProducts());

// Obtén todos los botones "Comprar" y los popups de productos
const buyButtons = document.querySelectorAll('.buy-button');
const productPopups = document.querySelectorAll('.product-popup');

buyButtons.forEach((buyButton, index) => {
    buyButton.addEventListener('click', () => {
        // Muestra el popup correspondiente al botón "Comprar" clicado
        productPopups[index].style.display = 'block';
    });
});

// Cuando se hace clic en "Agregar al carrito"
const addToCartButtons = document.querySelectorAll('.add-to-cart');

addToCartButtons.forEach((addToCartButton) => {
    addToCartButton.addEventListener('click', () => {
        // Recopila las opciones del producto, por ejemplo, los sabores seleccionados
        const selectedFlavors = Array.from(document.querySelectorAll('input[name="flavor"]:checked'))
            .map((flavor) => flavor.value);

        // Realiza la lógica para agregar el producto al carrito, por ejemplo, guardar en una lista
        // y actualizar el contador del carrito
        // ...

        // Cierra el popup
        addToCartButton.closest('.product-popup').style.display = 'none';
    });
});
