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
const common_1 = require("@nestjs/common");
const helper_1 = require("./user.resource/helper");
const user_model_1 = require("./user.model");
const admin = require("firebase-admin");
const DEBUG = true;
let UserService = class UserService {
    constructor() {
        this.users = new Map();
        this.DB = admin.firestore();
        this.populatedData = helper_1.Helper.populate();
        this.users = helper_1.Helper.populate();
        console.log(this.users);
    }
    async addUser(user) {
        try {
            var validBody = helper_1.Helper.validBody(user);
            if (validBody.valid) {
                var exists = await this.checkExistingUsers(user.email);
                if (!exists) {
                    var newUser = new user_model_1.User(user.name, user.age, user.email, user.password);
                    var validBody = helper_1.Helper.validBodyPut(user);
                    if (validBody.valid) {
                        if (await this.saveToDB(newUser)) {
                            if (DEBUG)
                                this.userLog();
                            return {
                                success: true,
                                data: newUser.toJson(),
                            };
                        }
                        else {
                            throw new Error(`Generic Database Error`);
                        }
                    }
                    else {
                        throw Error(`Payload is lacking`);
                    }
                }
                else {
                    throw new Error(`${user.email} is already used by another user!`);
                }
            }
            else {
                throw new Error(validBody.data);
            }
        }
        catch (error) {
            console.log(error);
            return { success: false, data: `Error adding account, ${error.message}` };
        }
    }
    async replaceUser(user, id) {
        try {
            var validBody = helper_1.Helper.validBodyPut(user);
            if (validBody.valid) {
                var newUser = this.users.get(id);
                var exists = await this.checkExistingUsers(user.email);
                if (!exists) {
                    if (newUser.replaceAllValues(user)) {
                        return {
                            success: true,
                            data: newUser.toJson(),
                        };
                    }
                    else {
                        return {
                            success: false,
                            data: `Invalid or insufficient input(s) is entered.`,
                        };
                    }
                }
                return {
                    success: false,
                    data: `Email ${user.email} already in database.`,
                };
            }
            else {
                throw new Error(validBody.data);
            }
        }
        catch (error) {
            return { success: false, data: `Error replacing account, ${error.message}` };
        }
    }
    async updateUser(user, id) {
        try {
            var validBody = helper_1.Helper.validBody(user);
            if (validBody.valid) {
                var newUser = this.users.get(id);
                if (!await this.checkExistingUsers(user.email)) {
                    if (newUser.update(user)) {
                        return {
                            success: true,
                            data: newUser.toJson(),
                        };
                    }
                    else {
                        return {
                            success: false,
                            data: `Invalid Input is entered.`,
                        };
                    }
                }
                else {
                    return {
                        success: false,
                        data: `Email ${user.email} already in database.`,
                    };
                }
            }
            else {
                throw new Error(validBody.data);
            }
        }
        catch (error) {
            return { success: false, data: `Error updating account, ${error.message}` };
        }
    }
    async userLog() {
        var results = [];
        try {
            var allUsers = await this.userLogObjects();
            allUsers.forEach((user) => {
                results.push(user.toJsonID());
            });
            return { success: true, data: results };
        }
        catch (error) {
            return null;
        }
    }
    async userLogObjects() {
        var results = [];
        try {
            var dbData = await this.DB.collection("users").get();
            dbData.forEach((doc) => {
                if (doc.exists) {
                    var data = doc.data();
                    results.push(new user_model_1.User(data["name"], data["age"], data["email"], data["password"], data["id"]));
                }
            });
            return results;
        }
        catch (error) {
            return null;
        }
    }
    async getUser(id) {
        try {
            var result = await this.DB.collection("users").doc(id).get();
            if (result.exists) {
                return {
                    success: true,
                    data: result.data(),
                };
            }
            else if (id === null) {
                return {
                    success: false,
                    data: `Invalid inputs!`,
                };
            }
            else {
                return {
                    success: false,
                    data: `User ${id} does not exist in the database!`,
                };
            }
        }
        catch (error) {
            console.log(error);
            return {
                success: false,
                data: error,
            };
        }
    }
    async deleteUser(id) {
        try {
            var result = await this.DB.collection("users").doc(id).get();
            if (result.exists) {
                await this.DB.collection("users").doc(id).delete();
                return { success: true, data: `Succesfully deleted user.` };
            }
            else {
                return { success: false, data: `Cannot find user.` };
            }
        }
        catch (error) {
            return { success: false, data: error };
        }
    }
    async verifyLogin(email, password) {
        try {
            var userResults = await this.DB.collection("users")
                .where("email", "==", email)
                .get();
            if (!userResults.empty) {
                for (const doc of userResults.docs) {
                    if (doc.data()["email"] === email) {
                        if (doc.data()["password"] === password) {
                            return {
                                success: true,
                                data: `Succesfully logged in!`,
                            };
                        }
                        else {
                            return {
                                success: false,
                                data: `Incorrect Password!`,
                            };
                        }
                    }
                    else {
                        return {
                            success: false,
                            data: `Email ${email} is not in the database`,
                        };
                    }
                }
            }
            else {
                return {
                    success: false,
                    data: `Email ${email} is not in the database`,
                };
            }
        }
        catch (error) {
            return {
                success: false,
                data: `Error logging in, ${error.message}`,
            };
        }
    }
    async searchUser(term) {
        try {
            var doesExists = 0;
            var intCheck = parseInt(term);
            var results = [];
            var dbDataID = await this.DB.collection("users").where("id", "==", term).get();
            var dbDataName = await this.DB.collection("users").where("name", "==", term).get();
            var dbDataEmail = await this.DB.collection("users").where("email", "==", term).get();
            var dbDataAge = await this.DB.collection("users").where("age", "==", intCheck).get();
            dbDataID.forEach((doc) => {
                if (doc.exists) {
                    doesExists++;
                    var data = doc.data();
                    results.push(new user_model_1.User(data["name"], data["age"], data["email"], data["id"]));
                }
            });
            dbDataName.forEach((doc) => {
                if (doc.exists) {
                    doesExists++;
                    var data = doc.data();
                    results.push(new user_model_1.User(data["name"], data["age"], data["email"], data["id"]));
                }
            });
            dbDataAge.forEach((doc) => {
                if (doc.exists) {
                    doesExists++;
                    var data = doc.data();
                    results.push(new user_model_1.User(data["name"], data["age"], data["email"], data["id"]));
                }
            });
            dbDataEmail.forEach((doc) => {
                if (doc.exists) {
                    doesExists++;
                    var data = doc.data();
                    results.push(new user_model_1.User(data["name"], data["age"], data["email"], data["id"]));
                }
            });
            if (doesExists != 0) {
                console.log(typeof term);
                return {
                    success: true,
                    data: results,
                };
            }
            else {
                return {
                    success: false,
                    data: `Cannot find anything related to ${term}`,
                };
            }
        }
        catch (error) {
            console.log(error);
            return {
                success: false,
                data: error.message,
            };
        }
    }
    async checkExistingUsers(email, options) {
        try {
            var userResults = await this.DB.collection("users")
                .where("email", "==", email)
                .get();
            console.log("Are the user results empty?");
            console.log(userResults.empty);
            if (userResults.empty) {
                return false;
            }
            for (const doc of userResults.docs) {
                console.log(doc.data());
                console.log("Are the options defined?");
                console.log(options != undefined);
                if (options != undefined) {
                    if (doc.id == (options === null || options === void 0 ? void 0 : options.exceptionID))
                        continue;
                }
                if (doc.data()["email"] === email) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
        catch (error) {
            console.log("Email exists subfunction error");
            console.log(error.message);
            return false;
        }
    }
    async saveToDB(user) {
        try {
            var result = await user.commit();
            return result.success;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map