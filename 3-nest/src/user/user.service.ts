import { All, Injectable } from '@nestjs/common';
import { User } from './user.model';

@Injectable()
export class UserService {

    private users: Map<string, User> = new Map<string, User>();

    addUser(user:any){
        var newUser: User;
        newUser = new User(user?.id, user?.name, user?.age, user?.email, user?.password);
        this.users.set(user.id, newUser);
        return true;
    }

    replaceUser(user:any, id:string){
        var newUser: User;
        newUser = new User(id, user?.name, user?.age, user?.email, user?.password);
        this.users.set(id, newUser);
        return true;
    }

    updateUser(user:any, id:string){
        var newUser:User = this.users.get(id);
        if(newUser.update(user)){
            return true;
        } else {
            return false;
        }
        
    }

    userLog(){
        var users = [];
        for (const [key, user] of this.users.entries()){
            users.push(user);
        }
        console.log(users);
        return users;
    }

    getUser(id:string){
        if (this.users.has(id)){
            return this.users.get(id).toJson();
        } else {
            console.log(id + " does not exist in the database!");
            return id + " does not exist in the database!";
        }
    }

    deleteUser(id:string){
        if (this.users.has(id)){
            this.users.delete(id);
        } else {
            console.log(id + " does not exist in the database!");
            return id + " does not exist in the database!";
        }
    }

    check(email: string, password: string){
        var check = 0;
        for (const [key, user] of this.users.entries()){
           if(user.login(email, password)){
               check = 1;
               break;
            } else {
                check = 0;
            }
        }
        if (check === 1){
            return "Welcome! " + email;
        } else {
            return "Incorrect Credentials!";
        }
    }

    searchUser(term:any){
        for (const [key, user] of this.users.entries()) {
            if (user.search(term) === true){
                return user.toJson();
            }
        }
    }

}
