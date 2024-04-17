import { expect } from 'chai';
import supertest from 'supertest';

const requester = supertest('http://localhost:8080');
describe("Testing Adopme App", () => {
  describe('Testing Products API', () => {
    let cookieValue;
    before(async () => {
        const mockLogin = {
            email: "matiascataldo923@gmail.com",
            password: "12345"
        };

        const response = await requester.post("/api/jwt/login").send(mockLogin);
        cookieValue = response.headers["set-cookie"][0];
    });

    it('Debe obtener todos los productos', async () => {
        const response = await requester.get('/api/products').set('Cookie', cookieValue);
        
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array');
    });
    
    it('Debe guardar un nuevo producto', async () => {
        const newProduct = {
            id: "H99",
            title: "Producto de prueba",
            description: "Producto Creado para prueba SuperTest.",
            price: 100,
            thumbnail: "urlImage",
            stock: 10,
            category: "Helado",
            owner: "admin"
        };
    
        const response = await requester.post('/api/products').send(newProduct).set('Cookie', cookieValue);
    
        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('status', 'success');
        expect(response.body).to.have.property('payload');
    });
    
    
    it('Debe eliminar un producto', async () => {
        const productId = '661fc76d88d82ab7fd29be58';
        
        const response = await requester
            .delete('/api/products').send({ productId }).set('Cookie', cookieValue);
        
        expect(response.status).to.equal(200);
    });
  });
});