import { expect } from 'chai';
import supertest from 'supertest';
import { generateJWToken, authToken } from '../src/utils.js';

const requester = supertest('http://localhost:8080');

describe("Testing Adopme App", () => {
    describe("Testing Users API", () => {
        it("Debe crear un nuevo usuario correctamente", async () => {
            const userMock = {
                first_name: "Nombre Test",
                last_name: "Apellido Test",
                email: "email@test.com",
                age: 18,
                password: "123qwe",
                loggedBy: "form",
                role: "admin",
            }

            const response = await requester.post('/api/jwt/register').send(userMock);

            expect(response.status).to.equal(201);
            expect(response.body.payload).to.be.ok;
        });
    });

    describe("Testing Login and Session with Cookies", () => {
        it("Debe poder hacer login correctamente con el usuario registrado previamente", async () => {
            const mockLogin = {
                email: "email@test.com",
                password: "123qwe"
            };

            const response = await requester.post("/api/jwt/login").send(mockLogin);

            expect(response.status).to.equal(201);
            expect(response.headers).to.have.property('set-cookie');
        });
        

        it("Debe enviar la cookie que contiene el usuario y destructurarla correctamente", async () => {
            const userMock = {
                first_name: "Nombre Test",
                last_name: "Apellido Test",
                email: "email@test.com",
                age: 18,
                password: "123qwe",
                loggedBy: "form",
                role: "admin",
            };

            const loginResponse = await requester.post("/api/jwt/login").send(userMock);
            const token = loginResponse.headers["set-cookie"][0].split("; ")[0].split("=")[1];
            

            expect(loginResponse.status).to.equal(201);
            
            
        });
    });
});
