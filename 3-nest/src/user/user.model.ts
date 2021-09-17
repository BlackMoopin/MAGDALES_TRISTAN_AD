export class User {

    private id: string;
    private name: string;
    private age: number;
    private email: string;
    private password: string;

    constructor(id:string, name:string, age:number, email:string, password:string){
        this.id = id;
        this.name = name;
        this.age = age; 
        this.email = email;
        this.password = password;
    }

    log(){
        console.log(`${this.id}:${this.name}:${this.age}:${this.email}`);
    }

    login(email: string, password:string){
        if (email.localeCompare(this.email) === 0 && password.localeCompare(this.password) === 0){
            return true;
        } else {
            return false;
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

    update(user:any){
        var changed = false;
        if (user.name){
            if (typeof user.name === 'string'){
                this.name = user.name;
                changed = true;
            }
        }
        if (user.age){
            if (typeof user.name === 'number'){
                this.age = parseInt(user.age);
                changed = true;
            }
        }
        if (user.email){
            if (typeof user.name === 'string'){
                this.email = user.email;
                changed = true;
            } 
        }
        if (user.password){
            if (typeof user.name === 'string'){
                this.password = user.password;
                changed = true;
            }
        }

        return changed;
    }

    toJson(){
        return{
            id: this.id,
            name: this.name,
            age: this.age,
            email: this.email
        }
    }

}