import { UserService } from './user.service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    register(body: any): Promise<import("./crud_return.interface").CRUDReturn>;
    login(email: string, password: string): Promise<import("./crud_return.interface").CRUDReturn>;
    getAllUser(): Promise<import("./crud_return.interface").CRUDReturn>;
    searchUser(term: string): Promise<import("./crud_return.interface").CRUDReturn>;
    getUserID(id: string): Promise<import("./crud_return.interface").CRUDReturn>;
    replaceValuePut(id: string, body: any): Promise<import("./crud_return.interface").CRUDReturn>;
    resetDatabase(): Promise<boolean>;
    replaceValuePatch(id: string, body: any): Promise<import("./crud_return.interface").CRUDReturn>;
    deleteUser(id: string): Promise<import("./crud_return.interface").CRUDReturn>;
}
