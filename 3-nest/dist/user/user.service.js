"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const admin = require("firebase-admin");
const helper_1 = require("./helper");
const common_1 = require("@nestjs/common");
const user_model_1 = require("./user.model");
const DEBUG = true;
let UserService = class UserService {
    constructor() {
        this.DB = admin.firestore();
    }
    async resetDatabase() {
        try {
            var currentDbState = await this.DB.collection("users").get();
            if (currentDbState.empty)
                return true;
            else {
                var batchOps = [];
                for (const doc of currentDbState.docs) {
                    batchOps.push(doc.ref.delete());
                }
                await Promise.all(batchOps);
                for (const user of helper_1.Helper.populate().values()) {
                    batchOps.push(this.saveToDB(user));
                }
                await Promise.all(batchOps);
                return true;
            }
        }
        catch (e) {
            console.log(e);
            return false;
        }
    }
    async resetDatabaseBasic() {
        try {
            var currentDbState = await this.DB.collection("users").get();
            if (currentDbState.empty)
                return true;
            else {
                for (const doc of currentDbState.docs) {
                    await doc.ref.delete();
                }
                for (const user of helper_1.Helper.populate().values()) {
                    await this.saveToDB(user);
                }
                return true;
            }
        }
        catch (e) {
            console.log(e);
            return false;
        }
    }
    async register(body) {
        try {
            var validBody = helper_1.Helper.validBodyPut(body);
            if (validBody.valid) {
                var exists = await this.emailExists(body.email);
                console.log(`Does ${body.email} exist in db? ${exists}`);
                if (!exists) {
                    var newUser = new user_model_1.User(body.name, body.age, body.email, body.password);
                    if (await this.saveToDB(newUser)) {
                        return {
                            success: true,
                            data: newUser.toJson(),
                        };
                    }
                    else {
                        throw new Error("generic database error");
                    }
                }
                else
                    throw new Error(`${body.email} is already in use by another user!`);
            }
            else {
                throw new Error(validBody.data);
            }
        }
        catch (error) {
            console.log("RegisterError");
            console.log(error.message);
            return { success: false, data: `Error adding account, ${error}` };
        }
    }
    async getOne(id) {
        try {
            var result = await this.DB.collection("users").doc(id).get();
            if (result.exists) {
                return {
                    success: true,
                    data: result.data(),
                };
            }
            else {
                return {
                    success: false,
                    data: `User ${id} does not exist in database!`,
                };
            }
        }
        catch (error) {
            console.log("Get one error");
            console.log(error.message);
            return {
                success: false,
                data: error.message,
            };
        }
    }
    async getAll() {
        var results = [];
        try {
            var allUsers = await this.getAllUserObjects();
            allUsers.forEach((user) => {
                results.push(user.toJson(true));
            });
            return { success: true, data: results };
        }
        catch (e) {
            return { success: false, data: e };
        }
    }
    async getAllUserObjects() {
        var results = [];
        try {
            var dbData = await this.DB.collection("users").get();
            dbData.forEach((doc) => {
                if (doc.exists) {
                    var data = doc.data();
                    results.push(new user_model_1.User(data["name"], data["age"], data["email"], data["password"], doc.id));
                }
            });
            return results;
        }
        catch (e) {
            return null;
        }
    }
    async searchUser(term) {
        try {
            var results = [];
            var users = await this.getAllUserObjects();
            for (const user of users.values()) {
                if (user.matches(term))
                    results.push(user.toJson());
            }
            return { success: results.length > 0, data: results };
        }
        catch (error) {
            console.log(error.message);
            return { success: false, data: error.message, };
        }
    }
    async replaceValuePut(id, body) {
        try {
            var user = await user_model_1.User.retrieve(id);
            if (user != null) {
                var validBodyPut = helper_1.Helper.validBodyPut(body);
                if (validBodyPut.valid) {
                    var exists = await this.emailExists(body.email, { exceptionId: id });
                    if (!exists) {
                        var success = user.replaceValues(body);
                        await user.commit(false);
                        if (success)
                            return {
                                success: success,
                                data: user.toJson(),
                            };
                        else {
                            throw new Error("Failed to update user in db");
                        }
                    }
                    else {
                        throw new Error(`${body.email} is already in use by another user!`);
                    }
                }
                else {
                    throw new Error(validBodyPut.data);
                }
            }
            else {
                throw new Error(`User ${id} is not in database`);
            }
        }
        catch (error) {
            console.log("PutError");
            console.log(error.message);
            return {
                success: false,
                data: error.message,
            };
        }
    }
    async replaceValuePatch(id, body) {
        try {
            var user = await user_model_1.User.retrieve(id);
            if (user != null) {
                var validBodyPatch = helper_1.Helper.validBody(body);
                if (validBodyPatch.valid) {
                    if (body.email != undefined) {
                        var exists = await this.emailExists(body.email, {
                            exceptionId: id,
                        });
                        if (exists) {
                            throw new Error(`${body.email} is already in use by another user!`);
                        }
                    }
                    var success = user.replaceValues(body);
                    console.log(user.toJson(false));
                    await user.commit(false);
                    if (success) {
                        return {
                            success: success,
                            data: user.toJson(),
                        };
                    }
                    else {
                        throw new Error("Failed to update user");
                    }
                }
                else {
                    throw new Error(validBodyPatch.data);
                }
            }
            else {
                throw new Error(`User ${id} is not in database`);
            }
        }
        catch (error) {
            console.log("PatchError");
            console.log(error.message);
            return {
                success: false,
                data: error.message,
            };
        }
    }
    async deleteUser(id) {
        try {
            var user = await user_model_1.User.retrieve(id);
            if (user != null) {
                var success = await user.delete();
                return {
                    success: success,
                    data: `User ${id} has been successfully removed`,
                };
            }
            else
                return {
                    success: false,
                    data: `User ${id} is not in database`,
                };
        }
        catch (error) {
            console.log("DeleteError");
            console.log(error.message);
            return {
                success: false,
                data: error.message,
            };
        }
    }
    async login(email, password) {
        try {
            var user = await user_model_1.User.retrieveViaEmail(email);
            if (user != null) {
                return user.login(password);
            }
            else {
                return { success: false, data: `${email} not found in database` };
            }
        }
        catch (error) {
            console.log("Login error");
            console.log(error.message);
            return { success: false, data: error.message, };
        }
    }
    async emailExists(email, options) {
        try {
            var userResults = await this.DB.collection("users")
                .where("email", "==", email)
                .get();
            console.log("Are the user results empty?");
            console.log(userResults.empty);
            if (userResults.empty)
                return false;
            for (const doc of userResults.docs) {
                console.log(doc.data());
                console.log("Are the options defined?");
                console.log(options != undefined);
                if (options != undefined) {
                    if (doc.id == (options === null || options === void 0 ? void 0 : options.exceptionId))
                        continue;
                }
                if (doc.data()["email"] === email) {
                    return true;
                }
                else {
                    return false;
                }
            }
            return false;
        }
        catch (error) {
            console.log("Email exists subfunction error");
            console.log(error.message);
            return false;
        }
    }
    async saveToDB(user) {
        console.log(`Attempting to save user ${user.id} ${user.email}`);
        try {
            var result = await user.commit(false);
            return result.success;
        }
        catch (error) {
            console.log("Save to db error");
            console.log(error.message);
            return false;
        }
    }
    async logAllUsers() {
        console.log(await this.getAll());
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map