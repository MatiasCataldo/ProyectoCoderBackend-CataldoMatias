import config from '../config/config.js';
import MongoSingleton from '../config/mongodb-singleton.js';

let userService;
let productService;

async function initializeMongoService() {
    console.log("Iniciando Servicio para MongoDB !!");
    try {
        await MongoSingleton.getInstance();
    } catch (error) {
        console.error("Error al iniciar MongoDB:", error);
        process.exit(1);
    }
}

async function initializeServices() {
    switch (config.persistence) {
        case 'mongodb':
            await initializeMongoService();
            const { default: UserServiceMongo } = await import('./dao/mongo/users.service.js');
            userService = new UserServiceMongo();
            console.log("Servicio de usuarios cargado:", UserServiceMongo);

            const { default: ProductsServiceMongo } = await import('./dao/mongo/products.service.js');
            productService = new ProductsServiceMongo();
            console.log("Servicio de productos cargado:", ProductsServiceMongo);
            break;

        case 'file':
            const { default: UserServiceFileSystem } = await import('./dao/filesystem/users.service.js');
            userService = new UserServiceFileSystem();
            console.log("Servicio de estudiantes cargado:", UserServiceFileSystem);

            const { default: ProductsServiceFileSystem } = await import('./dao/filesystem/produtcs.service.js');
            productService = new ProductsServiceFileSystem();
            console.log("Servicio de estudiantes cargado:", ProductsServiceFileSystem);
            break;

        default:
            console.error("Persistencia no válida en la configuración:", config.persistence);
            process.exit(1);
            break;
    }
}

export async function initializeAndExportServices() {
    await initializeServices();
    return { userService, productService };
}
