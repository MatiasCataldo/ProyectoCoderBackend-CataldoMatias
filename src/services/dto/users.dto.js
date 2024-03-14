export default class UsersDTO {
    constructor(user) {
        this.name = user.first_name;
        this.lastName = user.last_name;
        this.age = user.age;
        this.email = user.email_address;
        this.password = user.password;
        this.fullName = `${this.name} - ${this.lastName}`
    }
}