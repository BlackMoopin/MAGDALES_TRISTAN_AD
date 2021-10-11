import { CRUDReturn } from './crud_return.interface';
import { User } from './user.model';
export declare class UserService {
    private users;
    email: string;
    password: string;
    age: number;
    name: string;
    private DB;
    private populatedData;
    constructor();
    addUser(user: any): Promise<CRUDReturn>;
    replaceUser(user: any, id: string): Promise<CRUDReturn>;
    updateUser(user: any, id: string): Promise<CRUDReturn>;
    userLog(): Promise<CRUDReturn>;
    userLogObjects(): Promise<Array<User>>;
    getUser(id: string): Promise<CRUDReturn>;
    deleteUser(id: string): Promise<{
        success: boolean;
        data: any;
    }>;
    verifyLogin(email: string, password: string): Promise<CRUDReturn>;
    searchUser(term: string): Promise<CRUDReturn>;
    checkExistingUsers(email: string, options?: {
        exceptionID: string;
    }): Promise<boolean>;
    saveToDB(user: User): Promise<boolean>;
}
