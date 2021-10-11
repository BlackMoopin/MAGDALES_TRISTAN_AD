import { UserService } from './user.service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getAllUsers(body: any): Promise<import("./crud_return.interface").CRUDReturn>;
    getOneUser(id: string): Promise<import("./crud_return.interface").CRUDReturn>;
    postUser(body: any): Promise<import("./crud_return.interface").CRUDReturn>;
    replaceInfo(body: any, id: string): Promise<import("./crud_return.interface").CRUDReturn>;
    updateInfo(body: any, id: string): Promise<import("./crud_return.interface").CRUDReturn>;
    delete(id: string): Promise<{
        success: boolean;
        data: any;
    }>;
    userLogin(email: string, password: string): Promise<import("./crud_return.interface").CRUDReturn>;
    findUser(term: any): Promise<import("./crud_return.interface").CRUDReturn>;
}
