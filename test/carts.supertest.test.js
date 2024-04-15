import Cart from '../src/dao/models/cart.model.js'; 
import UserDao from "../src/dao/user.dao.js";  
import { expect } from 'chai';
import supertest from 'supertest';

const requester = supertest('http://localhost:8080');
const userDao = new UserDao();

describe('Testing Carts API', () => {
    let userId;
    let cartId;

    before(async function() {
        this.timeout(10000); 
        const userMock = {
            first_name: "Nombre Test",
            last_name: "Apellido Test",
            email: "email@testcart.com",
            age: 18,
            password: "123qwe",
            loggedBy: "form",
            role: "admin",
        }

        // Crea un usuario en la base de datos de prueba y obtén su ID
        const user = await userDao.createUser(userMock);
        userId = user._id;

        // Crea un carrito para el usuario en la base de datos de prueba y obtén su ID
        const cart = await userDao.createNewCart(userId);
        cartId = cart._id;
    });

    describe('GET /:userId', () => {
        it('Debe devolver el carito de un usuario especifico', async () => {
            const res = await requester.get(`/api/cart/${userId}`);
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
        });
    });

});
