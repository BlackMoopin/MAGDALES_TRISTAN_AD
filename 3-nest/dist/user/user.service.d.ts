import { CRUDReturn } from "./crud_return.interface";
import { User } from "./user.model";
export declare class UserService {
    private DB;
    constructor();
    resetDatabase(): Promise<boolean>;
    resetDatabaseBasic(): Promise<boolean>;
    register(body: any): Promise<CRUDReturn>;
    getOne(id: string): Promise<CRUDReturn>;
    getAll(): Promise<CRUDReturn>;
    getAllUserObjects(): Promise<Array<User>>;
    searchUser(term: string): Promise<CRUDReturn>;
    replaceValuePut(id: string, body: any): Promise<CRUDReturn>;
    replaceValuePatch(id: string, body: any): Promise<CRUDReturn>;
    deleteUser(id: string): Promise<CRUDReturn>;
    login(email: string, password: string): Promise<CRUDReturn>;
    emailExists(email: string, options?: {
        exceptionId: string;
    }): Promise<boolean>;
    saveToDB(user: User): Promise<boolean>;
    logAllUsers(): Promise<void>;
}
