"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const helper_1 = require("./helper");
class User {
    constructor(name, age, email, password) {
        this.id = helper_1.Helper.generateUID();
        this.name = name;
        this.age = age;
        this.email = email;
        this.password = password;
    }
    login(password) {
        try {
            if (this.password === password) {
                return { success: true, data: this.toJson() };
            }
            else {
                throw new Error(`${this.email} login fail, password does not match`);
            }
        }
        catch (error) {
            return { success: false, data: error.message };
        }
    }
    toJson() {
        return {
            id: this.id,
            name: this.name,
            age: this.age,
            email: this.email
        };
    }
}
exports.User = User;
//# sourceMappingURL=user.model.js.map