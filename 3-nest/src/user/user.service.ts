import { Injectable } from '@nestjs/common';
import { CRUDReturn } from './crud_return.interface';
import { Helper } from './user.resource/helper';
import { User } from './user.model';
import * as admin from 'firebase-admin';

const DEBUG: boolean = true;

@Injectable()
export class UserService {

    private users: Map<string, User> = new Map<string, User>();
    email:string;
    password: string;
    age:number;
    name: string;

    private DB = admin.firestore();

    private populatedData : Map<string,User> = Helper.populate();

    constructor()
    {
        this.users = Helper.populate();
        console.log(this.users);
    }

    async addUser(user:any): Promise<CRUDReturn>{
        try {
            var validBody: {valid: boolean; data: string} = Helper.validBody(user);
            if (validBody.valid){
                var exists = await this.checkExistingUsers(user.email);
                if (!exists){
                    var newUser: User = new User(
                        user.name,
                        user.age,   
                        user.email,
                        user.password
                    );
                    var validBody: {valid: boolean; data: string} = Helper.validBodyPut(user);
                    if (validBody.valid){
                        if (await this.saveToDB(newUser)){
                            if (DEBUG) this.userLog();
                                return {
                                    success: true,
                                    data: newUser.toJson(),
                                };
                        } else{
                            throw new Error(`Generic Database Error`);
                        } 
                    } else {
                        throw Error(`Payload is lacking`);
                    }
                    
                } else {
                    throw new Error(`${user.email} is already used by another user!`)
                }
            } else {
                throw new Error(validBody.data);
            }
        } catch (error) {
            console.log(error);
            return { success: false, data: `Error adding account, ${error.message}`};
        }
        
    }

    async replaceUser(user:any, id:string): Promise<CRUDReturn>{
        try {
            var validBody: {valid: boolean; data: string} = Helper.validBodyPut(user);
            if (validBody.valid){
                var newUser:User = this.users.get(id);
                var exists = await this.checkExistingUsers(user.email);
                if (!exists){
                    if(newUser.replaceAllValues(user)){
                        return {
                            success: true,
                            data: newUser.toJson(),
                        };
                    } else {
                        return {
                            success: false,
                            data: `Invalid or insufficient input(s) is entered.`,
                        };
                    }
                } return {
                    success: false,
                    data: `Email ${user.email} already in database.`,
                };
                    
                } else {
                    throw new Error(validBody.data);
                }
        } catch (error) {
            return { success: false, data: `Error replacing account, ${error.message}`};
        }      
    }

    async updateUser(user:any, id:string) : Promise<CRUDReturn>{
        try {
            var validBody: {valid: boolean; data: string} = Helper.validBody(user);
            if (validBody.valid){
                var newUser:User = this.users.get(id);
                if (!await this.checkExistingUsers(user.email)){
                    if(newUser.update(user)){
                        return {
                            success: true,
                            data: newUser.toJson(),
                        };
                    } else {
                        return {
                            success: false,
                            data: `Invalid Input is entered.`,
                        };
                    }
                } else {
                    return {
                        success: false,
                        data: `Email ${user.email} already in database.`,
                    };
                }
            } else {
                throw new Error(validBody.data);
            }
        } catch (error) {
            return { success: false, data: `Error updating account, ${error.message}`};
        }
        
    }

    async userLog(): Promise<CRUDReturn> {
        var results: Array<any> = [];
        try {
            var allUsers = await this.userLogObjects();
            allUsers.forEach((user)=> {
                results.push(user.toJsonID());
            });
            return {success: true, data: results};
        } catch (error) {
            return null;
        }
    }

    async userLogObjects(): Promise<Array<User>> {
        var results: Array<User> = [];
        try {
            var dbData: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> = 
                await this.DB.collection("users").get();
            dbData.forEach((doc)=>{
                if (doc.exists) {
                    var data = doc.data();
                    results.push( new User(
                        data["name"],
                        data["age"],
                        data["email"],
                        data["password"],
                        data["id"],
                    ));
                }
            });
            return results;         
        } catch (error) {
            return null;
        }
    }

    async getUser(id:string) : Promise<CRUDReturn>{
        try {
            var result = await this.DB.collection("users").doc(id).get();
            if (result.exists){
                return{
                    success: true,
                    data: result.data(),
                };
            } else if (id === null){
                return{
                    success: false,
                    data: `Invalid inputs!`,
                };
            } else {
                return{
                    success: false,
                    data: `User ${id} does not exist in the database!`,
                };
            } 
        } catch (error) {
            console.log(error);
            return{
                success: false,
                data: error,
            };
        }
    }

    //maybe finished?
    async deleteUser(id:string){
        try{
            var result = await this.DB.collection("users").doc(id).get();
            if (result.exists){
                await this.DB.collection("users").doc(id).delete();
                return {success: true, data: `Succesfully deleted user.`}
            } else {
                return {success: false, data: `Cannot find user.`};
            }
        } catch (error){
            return {success: false, data: error};
        }
    }

    async verifyLogin(email: string, password: string): Promise<CRUDReturn>{
        try {
            var userResults = await this.DB.collection("users")
                .where("email", "==", email)
                .get();
           
            if (!userResults.empty){
                for (const doc of userResults.docs){
                    if (doc.data()["email"] === email){
                        if (doc.data()["password"] === password){
                            return {
                                success: true,
                                data: `Succesfully logged in!`,
                            };
                        } else {
                            return {
                                success: false,
                                data: `Incorrect Password!`,
                            };
                        }
                    } else {
                        return {
                            success: false,
                            data: `Email ${email} is not in the database`,
                        }
                    }
                }
            } else {
                return {
                    success: false,
                    data: `Email ${email} is not in the database`,
                }
            }
        } catch (error) {
            return { 
                success: false, 
                data: `Error logging in, ${error.message}`, 
            };
        }
        
    }

    //finish
    async searchUser(term:string): Promise<CRUDReturn>{
        // var results: Array<any> = [];
        // for (const user of this.users.values()) {
        //     if (user.matches(term)){
        //         results.push(user.toJson());
        //     }
        // }
        // return {
        //     success: results.length>0,
        //     data: results,
        // };
        try {
            var doesExists: number = 0;
            var intCheck: number = parseInt(term);
            var results: Array<User> = [];
            var dbDataID: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> = 
                await this.DB.collection("users").where("id", "==", term).get();
            var dbDataName: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> = 
                await this.DB.collection("users").where("name", "==", term).get();
            var dbDataEmail: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> = 
                await this.DB.collection("users").where("email", "==", term).get();
            var dbDataAge: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> = 
                await this.DB.collection("users").where("age", "==", intCheck).get();
            dbDataID.forEach((doc)=>{
                if (doc.exists) {
                    doesExists++;
                    var data = doc.data();
                    results.push( new User(
                        data["name"],
                        data["age"],
                        data["email"],
                        data["id"],
                    ));
                }
            });
            dbDataName.forEach((doc)=>{
                if (doc.exists) {
                    doesExists++;
                    var data = doc.data();
                    results.push( new User(
                        data["name"],
                        data["age"],
                        data["email"],
                        data["id"],
                    ));
                }
            });
            dbDataAge.forEach((doc)=>{
                if (doc.exists) {
                    doesExists++;
                    var data = doc.data();
                    results.push( new User(
                        data["name"],
                        data["age"],
                        data["email"],
                        data["id"],
                    ));
                }
            });
            dbDataEmail.forEach((doc)=>{
                if (doc.exists) {
                    doesExists++;
                    var data = doc.data();
                    results.push( new User(
                        data["name"],
                        data["age"],
                        data["email"],
                        data["id"],
                    ));
                }
            });
            
            if (doesExists != 0){
                console.log(typeof term);
                return{
                    success: true,
                    data: results,
                };
            } else {
                return{
                    success: false,
                    data: `Cannot find anything related to ${term}`,
                };
            }
        } catch (error) {
            console.log(error);
            return{
                success: false,
                data: error.message,
            };
        }
    }

    
    //initial
    // checkExistingUsers(term:string): boolean{
    //     for (const user of this.users.values()) {
    //         if (user.search(term) === true){
    //             return true;
    //         }
    //     }
    // }

    async checkExistingUsers(email:string, options?: {exceptionID: string}): Promise<boolean>{
        try{
            var userResults = await this.DB.collection("users")
                .where("email", "==", email)
                .get();
            console.log("Are the user results empty?");
            console.log(userResults.empty);
            if (userResults.empty) {
                return false;
            }
            for (const doc of userResults.docs){
                console.log(doc.data());
                console.log("Are the options defined?");
                console.log(options != undefined);
                if (options != undefined){
                    if (doc.id == options?.exceptionID) continue;
                }
                if (doc.data()["email"] === email) {
                    return true;
                } else {
                    return false;
                }
            }
        } catch (error){
            console.log("Email exists subfunction error");
            console.log(error.message);
            return false;
        }
    }

    //finish
    async saveToDB(user: User): Promise<boolean>{
        try {
            var result = await user.commit();
            return result.success;
            // var vcut = this.DB.collection("users").doc(user.id).set(user.toJson());
            // console.log(vcut);
            // this.users.set(user.id, user);
            // return this.users.has(user.id);
        } catch (error) {
            console.log(error);
            return false;
        }
    }

}
