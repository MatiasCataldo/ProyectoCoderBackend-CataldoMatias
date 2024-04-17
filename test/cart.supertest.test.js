import { expect } from 'chai';
import supertest from 'supertest';

const requester = supertest('http://localhost:8080');
describe("Testing Adopme App", () => {
  describe('Testing Cart API', () => {
    const userId = '661e6d4aeee547a9f5d47eda'; // ID de usuario de ejemplo
    const productId = '65f504d7710aef99f96b6ecd'; // ID de producto de ejemplo
    const cartId = '661e91d8868047b1a7a0e42e'; // ID de carrito de ejemplo
    
    let cookieValue;

    before(async () => {
      const mockLogin = {
        email: "matiascataldo923@gmail.com",
        password: "12345"
      };

      const response = await requester.post("/api/jwt/login").send(mockLogin);
      cookieValue = response.headers["set-cookie"][0];
    });

    it('Debe obtener el carrito del usuario', async () => {
      const response = await requester.get(`/api/carts/${userId}`).set('Cookie', cookieValue);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('cart');
    });

    it('Debe agregar un ítem al carrito', async () => {
      const newItem = {
        productName: 'Helado Artesanal de 1/4Kg',
        productId: productId,
        quantity: 2,
        productPrice: 11600
      };

      const response = await requester.post(`/api/carts/${userId}/addItem`).send(newItem).set('Cookie', cookieValue);

      expect(response.status).to.equal(201);
      expect(response.body).to.have.property('cart');
    });

    it('Debe finalizar la compra', async () => {
      const response = await requester.post(`/api/carts/${userId}/${cartId}/purchase`).set('Cookie', cookieValue);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('message', 'Compra realizada con éxito.');
    });
  });
});
