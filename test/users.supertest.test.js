import { expect } from 'chai';
import supertest from 'supertest';
import { authToken } from '../src/utils.js';

const requester = supertest('http://localhost:8080');

describe("Testing Adopme App", () => {
    let cookie;
    describe("Testing Users API", () => {
        it("Debe crear un nuevo usuario correctamente", async function() {
            const mockUser = {
                first_name: "Nombre Test",
                last_name: "Apellido Test",
                email: "email@test.com",
                age: 18,
                password: "123qwe",
                loggedBy: "form",
                role: "admin",
            }

            const response = await requester.post('/api/jwt/register').send(mockUser);

            expect(response).to.be.ok;
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
            expect(response).to.be.ok;
        });
        
        it("Debe enviar la cookie que contiene el usuario y destructurarla correctamente", async () => {
            const mockLogin = {
                email: "email@test.com",
                password: "123qwe"
            };

            const response = await requester.post("/api/jwt/login").send(mockLogin);
            const cookieResult = response.headers["set-cookie"][0]
            expect(cookieResult).to.be.ok;
            cookie = {
                name: cookieResult.split('=')[0],
                value: cookieResult.split('=')[1]
            }
            expect(cookie.name).to.be.ok.and.eql('jwtCookieToken');
            expect(cookie.value).to.be.ok;
            expect(response.status).to.equal(201);
            expect(response.headers).to.have.property('set-cookie');
        });  
    });
});
