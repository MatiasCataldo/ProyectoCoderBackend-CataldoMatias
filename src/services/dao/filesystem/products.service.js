import __dirname from '../../../util.js';
import fileSystem from 'fs';

export default class ProductService {
    #products;
    #dirPath;
    #filePath;
    #fileSystem;


    constructor() {
        this.#products = new Array();
        this.#dirPath = __dirname + '/files';
        this.#filePath = this.#dirPath + "/products.json";
        this.#fileSystem = fileSystem;
    }

    #prepararDirectorioBase = async () => {
        await this.#fileSystem.promises.mkdir(this.#dirPath, { recursive: true });
        if (!this.#fileSystem.existsSync(this.#filePath)) {
            await this.#fileSystem.promises.writeFile(this.#filePath, "[]");
        }
    }

    save = async (product) => {
        console.log("Guardar recurso:");
        console.log(product);
        product.id = Math.floor(Math.random() * 20000 + 1);
        try {
            await this.#prepararDirectorioBase();
            this.#products = await this.getAll();
            this.#products.push(product);
            await this.#fileSystem.promises.writeFile(this.#filePath, JSON.stringify(this.#products));
        } catch (error) {
            console.error(`Error guardando producto: ${JSON.stringify(productoNuevo)}, detalle del error: ${error}`);
            throw Error(`Error guardando producto: ${JSON.stringify(productoNuevo)}, detalle del error: ${error}`);
        }
    }

    getAll = async () => {
        try {
            await this.#prepararDirectorioBase();
            let data = await this.#fileSystem.promises.readFile(this.#filePath, "utf-8");
            console.log(data);
            this.#products = JSON.parse(data);
            console.log("Productos encontrados: ");
            console.log(this.#products);
            return this.#products;
        } catch (error) {
            console.error(`Error consultando los productos por archivo, valide el archivo: ${this.#dirPath}, 
                detalle del error: ${error}`);
            throw Error(`Error consultando los productos por archivo, valide el archivo: ${this.#dirPath},
                detalle del error: ${error}`);
        }
    }
};