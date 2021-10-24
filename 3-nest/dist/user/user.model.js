"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const admin = require("firebase-admin");
const helper_1 = require("./helper");
class User {
    constructor(name, age, email, password, id) {
        if (id != undefined) {
            this.id = id;
        }
        else {
            this.id = helper_1.Helper.generateUID();
        }
        this.name = name;
        this.age = age;
        this.email = email;
        this.password = password;
    }
    static async retrieve(id) {
        try {
            var DB = admin.firestore();
            var result = await DB.collection("users").doc(id).get();
            if (result.exists) {
                var data = result.data();
                return new User(data["name"], data["age"], data["email"], data["password"], result.id);
            }
            else {
                return null;
            }
        }
        catch (error) {
            console.log("User.retrieve error");
            console.log(error.message);
            return null;
        }
    }
    static async retrieveViaEmail(email) {
        var DB = admin.firestore();
        var userResults = await DB.collection("users")
            .where("email", "==", email)
            .get();
        if (userResults.empty)
            return null;
        for (const doc of userResults.docs) {
            var data = doc.data();
            return new User(data["name"], data["age"], data["email"], data["password"], doc.id);
        }
    }
    async delete() {
        try {
            var DB = admin.firestore();
            await DB.collection("users").doc(this.id).delete();
            return true;
        }
        catch (error) {
            console.log("User.delete error");
            console.log(error.message);
            return false;
        }
    }
    async commit(hidePassword = true) {
        try {
            var DB = admin.firestore();
            var result = await DB.collection("users").doc(this.id).set(this.toJson(hidePassword));
            return {
                success: true,
                data: this.toJson(true),
            };
        }
        catch (error) {
            console.log("User.committ error message");
            console.log(error.message);
            return { success: false, data: error.message, };
        }
    }
    toJson(hidePassword = true) {
        if (hidePassword)
            return {
                id: this.id,
                name: this.name,
                age: this.age,
                email: this.email,
            };
        return {
            name: this.name,
            age: this.age,
            email: this.email,
            password: this.password,
        };
    }
    login(password) {
        console.log(`current password ${this.password}, attempt: ${password}`);
        try {
            if (this.password === password) {
                return { success: true, data: this.toJson() };
            }
            else {
                throw new Error(`${this.email} login fail, password does not match`);
            }
        }
        catch (error) {
            return { success: false, data: error.message, };
        }
    }
    matches(term) {
        var keys = helper_1.Helper.describeClass(User);
        keys = helper_1.Helper.removeItemOnce(keys, "password");
        for (const key of keys) {
            if (`${this[key]}` === term)
                return true;
        }
        return false;
    }
    replaceValues(body) {
        try {
            var keys = helper_1.Helper.describeClass(User);
            keys = helper_1.Helper.removeItemOnce(keys, "id");
            for (const key of Object.keys(body)) {
                this[key] = body[key];
            }
            return true;
        }
        catch (error) {
            console.log("User.replaceValues error");
            console.log(error.message);
            return false;
        }
    }
    log() {
        console.log(this.toJson());
    }
}
exports.User = User;
//# sourceMappingURL=user.model.js.map