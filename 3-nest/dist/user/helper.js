"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Helper = void 0;
const user_model_1 = require("./user.model");
const uuid_1 = require("uuid");
class Helper {
    static describeClass(typeOfClass) {
        let a = new typeOfClass();
        let array = Object.getOwnPropertyNames(a);
        return array;
    }
    static generateUID() {
        return (0, uuid_1.v4)().toString().replace(/-/g, '').substring(0, 27);
    }
    static removeItemOnce(arr, value) {
        var index = arr.indexOf(value);
        if (index > -1) {
            arr.splice(index, 1);
        }
        return arr;
    }
    static populate() {
        var result = new Map();
        try {
            var users = [
                new user_model_1.User('Leanne Graham', 18, 'sincere@april.biz', 'LG_123456'),
                new user_model_1.User('Ervin Howell', 21, 'shanna@melissa.tv', 'EH_123123'),
                new user_model_1.User('Nathan Plains', 25, 'nathan@yesenia.net', 'NP_812415'),
                new user_model_1.User('Patricia Lebsack', 18, 'patty@kory.org', 'PL_12345'),
            ];
            users.forEach((user) => {
                result.set(user.id, user);
            });
            return result;
        }
        catch (error) {
            console.log("Helper.populate error");
            console.log(error.message);
            return null;
        }
    }
    static validBody(body) {
        try {
            var keys = ['name', 'age', 'email', 'password'];
            var types = new Map();
            types.set('name', typeof '');
            types.set('age', typeof 0);
            types.set('email', typeof '');
            types.set('password', typeof '');
            for (const key of Object.keys(body)) {
                if (!keys.includes(`${key}`) && typeof body[key] != types.get(key)) {
                    return { valid: false, data: `${key} is not a valid attribute` };
                }
                if (typeof body[key] != types.get(key)) {
                    throw new Error(`${key} with value ${body[key]} with type ${typeof body[key]} is not a valid entry, expecting ${key}:${types.get(key)}`);
                }
            }
            return { valid: true, data: null };
        }
        catch (error) {
            return { valid: false, data: error.message, };
        }
    }
    static validBodyPut(body) {
        try {
            var bodyValidation = this.validBody(body);
            if (bodyValidation.valid) {
                var keys = Helper.describeClass(user_model_1.User);
                keys = Helper.removeItemOnce(keys, "id");
                for (const key of Object.keys(body)) {
                    if (keys.includes(`${key}`)) {
                        keys = Helper.removeItemOnce(keys, key);
                    }
                }
                if (keys.length > 0) {
                    throw new Error(`Payload is missing ${keys}`);
                }
                return { valid: true, data: null };
            }
            else
                throw new Error(bodyValidation.data);
        }
        catch (error) {
            return { valid: false, data: error.message, };
        }
    }
}
exports.Helper = Helper;
//# sourceMappingURL=helper.js.map