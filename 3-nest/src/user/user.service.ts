import { Injectable } from '@nestjs/common';
import { CRUDReturn } from './crud_return.interface';
import { Helper } from './user.resource/helper';
import { User } from './user.model';

const DEBUG: boolean = true;

@Injectable()
export class UserService {

    private users: Map<string, User> = new Map<string, User>();
    email:string;
    password: string;
    age:number;
    name: string;

    private populatedData : Map<string,User> = Helper.populate();

    constructor()
    {
        this.users = Helper.populate();
        console.log(this.users);
    }

    //post - finished
    addUser(user:any): CRUDReturn{
        try {
            var validBody: {valid: boolean; data: string} = Helper.validBody(user);
            if (validBody.valid){
                if (!this.checkExistingUsers(user.email)){
                    var newUser: User = new User(
                        user.name,
                        user.age,
                        user.email,
                        user.password,
                    );
                    var validBody: {valid: boolean; data: string} = Helper.validBodyPut(user);
                    if (validBody.valid){
                        if (this.saveToDB(newUser)){
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

    //put - finished
    replaceUser(user:any, id:string): CRUDReturn{
        try {
            var validBody: {valid: boolean; data: string} = Helper.validBodyPut(user);
            if (validBody.valid){
                var newUser:User = this.users.get(id);
                if (!this.checkExistingUsers(user.email)){
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

    //patch - finished
    updateUser(user:any, id:string) : CRUDReturn{
        try {
            var validBody: {valid: boolean; data: string} = Helper.validBody(user);
            if (validBody.valid){
                var newUser:User = this.users.get(id);
                if (!this.checkExistingUsers(user.email)){
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

    //finish
    userLog(): CRUDReturn {
        var results: Array<any> = [];
        for (const user of this.users.values()){
            results.push(user.toJson());
            console.log(results);
        }
        return { success: results.length>0, data: results};
    }

    //finish
    getUser(id:string) : CRUDReturn{
        if (this.users.has(id)){
            return { success: true, data: this.users.get(id).toJson()};
        } else {
            console.log(id + " does not exist in the database!");
            return { 
                success: false, 
                data: `User ${id} is not in the database`, 
            };
        }
    }

    //finish
    deleteUser(id:string){
        try {
            if (this.users.has(id)){
                this.users.delete(id);
                return {
                    success: true,
                    data: `User has been deleted succesfully.`,
                };
            } else {
                return { 
                    success: false, 
                    data: `User ${id} is not in the database`, 
                };
            }
        } catch (error) {
            return { 
                success: false, 
                data: `User ${id} is not in the database`, 
            };
        }
    }

    //finish
    check(email: string, password: string): CRUDReturn{
        var check: number = 0;
        try {
            for (const user of this.users.values()){
                if (user.matches(email)){
                    if(user.login(password)){
                        return user.login(password);
                        check = 1;
                        break;
                    } else {
                        throw new Error(`Invalid Password for ${email}!`);
                    }
                } 
            }

            if (check === 0){
                return { 
                    success: false, 
                    data: `Email ${email} is not in the database`, 
                };
            }
        } catch (error) {
            return { 
                success: false, 
                data: `Error logging in, ${error.message}`, 
            };
        }
        
    }

    //finish
    searchUser(term:string): CRUDReturn{
        var results: Array<any> = [];
        for (const user of this.users.values()) {
            if (user.matches(term)){
                results.push(user.toJson());
            }
        }
        return {
            success: results.length>0,
            data: results,
        };
    }

    //finish
    checkExistingUsers(term:string): boolean{
        for (const user of this.users.values()) {
            if (user.search(term) === true){
                return true;
            }
        }
    }

    //finish
    saveToDB(user: User): boolean{
        try {
            this.users.set(user.id, user);
            return this.users.has(user.id);
        } catch (error) {
            console.log(error);
            return false;
        }
    }

}
