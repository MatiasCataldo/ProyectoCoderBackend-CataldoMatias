import usersModel from "../../../dao/models/user.model.js";

export default class UsersServiceMongo {
    constructor() {
        console.log("Trabajando usuarios con persistencia de datos en MongoDB");
    }

    getAll = async () => {
        let users = await usersModel.find();
        return users.map(user => user.toObject());
    }
    save = async (user) => {
        let result = await usersModel.create(user);
        return result;
    }

    findByUsername = async (username) => {
        const result = await usersModel.findOne({ email: email });
        return result;
    };

    update = async (filter, value) => {
        console.log("Update student with filter and value:");
        console.log(filter);
        console.log(value);
        let result = await usersModel.updateOne(filter, value);
        return result;
    }
}