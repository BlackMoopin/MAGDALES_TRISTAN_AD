import { userInfo } from "os";
import * as admin from 'firebase-admin';
import { CRUDReturn } from "./crud_return.interface";
import { Helper } from "./user.resource/helper";

export class User {

    public id: string;
    private name: string;
    private age: number;
    private email: string;
    private password: string;

    constructor(name:string, age:number, email:string, password:string, id?:string){
        if (id!=undefined){
            this.id = id;
        } else {
            this.id = Helper.generateUID();
        }
        this.name = name;
        this.age = age; 
        this.email = email;
        this.password = password;
    }

    static async retrieve (id:string): Promise<User>{
        try {
            var DB = admin.firestore();
            var result = await DB.collection("users").doc(id).get();
            if (result.exists){
                var data = result.data();
                return new User(
                    result.id, 
                    data['name'], 
                    data['age'], 
                    data['email'], 
                    data['password']
                );
            }
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async commit(): Promise<CRUDReturn> {
        try {
            var DB = admin.firestore();
            var result = await DB.collection("users").doc(this.id).set(this.toJson());
            console.log(result);
            return {
                success: true,
                data: this.toJson(),
            };
        } catch (error) {
            console.log(error);
            return {success: false, data: error};
        }
    }

    log(){
        console.log(`${this.id}:${this.name}:${this.age}:${this.email}`);
    }

    login(password:string): CRUDReturn{
        try {
            if (this.password === password) {
            return { success: true, data: this.toJson() };
            } else {
            throw new Error(`${this.email} login fail, password does not match`);
            }
        } catch (error) {
            return { success: false, data: error.message };
        }
    }

    search(term:any){
        if (term === this.id){
            return true;
        }
        if (term === this.name){
            return true;
        }
        if (term === this.age){
            return true;
        }
        if (term === this.email){
            return true;
        }
    }

    //for put
    replaceAllValues(body: any): boolean {
        var changed: number = 0;
        if (body.name){
            if (typeof body.name === 'string'){
                this.name = body.name;
                changed++;
            }
        }
        if (body.age){
            if (typeof body.age === typeof 0){
                this.age = parseInt(body.age);
                changed++;
            }
        }
        if (body.email){
            if (typeof body.email === 'string'){
                this.email = body.email;
                changed++;
            } 
        }
        if (body.password){
            if (typeof body.password === 'string'){
                this.password = body.password;
                changed++;
            }
        }

        console.log(changed);

        if (changed === 4){
            return true;
        } else {
            return false;
        }
    }

    //for patch
    async update(user:any): Promise<boolean>{
        var changed = false;
        if (user.name){
            if (typeof user.name === 'string'){
                this.name = user.name;
                changed = true;
            }
        }
        if (user.age){
            if (typeof user.age === 'number'){
                this.age = parseInt(user.age);
                changed = true;
            }
        }
        if (user.email){
            if (typeof user.email === 'string'){
                this.email = user.email;
                changed = true;
            } 
        }
        if (user.password){
            if (typeof user.password === 'string'){
                this.password = user.password;
                changed = true;
            }
        }
 
        return changed;
    }

    matches(term: string): boolean {
        var keys: Array<string> = Helper.describeClass(User);
        keys = Helper.removeItemOnce(keys, 'password');
        for (const key of keys){
            if (`${this[key]}` === term){
                return true;
            }
        }
    }

    toJson(){
        return{
            name: this.name,
            age: this.age,
            email: this.email,
            password: this.password,
        }
    }

    toJsonID(){
        return{
            id: this.id,
            name: this.name,
            age: this.age,
            email: this.email,
        }
    }

}