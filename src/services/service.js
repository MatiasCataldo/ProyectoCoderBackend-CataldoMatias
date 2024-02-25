import UserServiceDao from "./dao/mongo/users.service.js";
import ProductsDao from "./dao/mongo/products.service.js"

import UserRepository from '../dao/user.dao.js'
import productsRepository from '../dao/product.dao.js'

// Generamos las instancias de las clases
const userDao = new UserServiceDao()
const productDao = new ProductsDao();

export const UserService = new UserRepository(userDao);
export const productsService = new productsRepository(productDao);