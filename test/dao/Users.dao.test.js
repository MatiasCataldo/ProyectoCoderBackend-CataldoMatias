import mongoose from "mongoose";
import UserDao from '../../src/dao/user.dao.js';
import Assert from 'assert';

const MONGO_URL = "mongodb://127.0.0.1/clase40-adoptme-test";

mongoose.connect(MONGO_URL);

const assert = Assert.strict

describe('Testing User Dao', () => {
    before(function () {
        this.userDao = new UserDao()
    })

    beforeEach(function () {
        this.timeout(10000) // time de espera ya que estamos usando una DB
        mongoose.connection.collections.users.drop();
    })

    it('El dao debe devolver los usuarios en forma de arreglo', async function () {
        // Given
        const isArray = true

        // Then
        const result = await this.userDao.getUsers()
        console.log(result);

        // Assert that
        assert.strictEqual(Array.isArray(result), isArray)
    })


    it('El dao debe agregar el usuario correctamente a la DB', async function () {
        // Given
        let mockUser = {
            first_name: "Usuario Test 01",
            last_name: "Apellido Test 01",
            email: "test01@test.com",
            password: "123qwe",
        }
        // Then
        const result = await this.userDao.createUser(mockUser)
        // console.log(result);

        // Assert that
        assert.ok(result._id)
    })

    afterEach(function () {
        mongoose.connection.collections.users.drop();
    })

})



// se ejecuta con: npx mocha test/dao/Users.dao.test.js