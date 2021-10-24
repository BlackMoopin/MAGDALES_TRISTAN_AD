import { CRUDReturn } from "./crud_return.interface";
export declare class User {
    id: string;
    private name;
    private age;
    email: string;
    private password;
    constructor(name: string, age: number, email: string, password: string, id?: string);
    static retrieve(id: string): Promise<User>;
    static retrieveViaEmail(email: string): Promise<User>;
    delete(): Promise<boolean>;
    commit(hidePassword?: boolean): Promise<CRUDReturn>;
    toJson(hidePassword?: boolean): {
        id?: string;
        name: string;
        age: number;
        email: string;
        password?: string;
    };
    login(password: string): CRUDReturn;
    matches(term: string): boolean;
    replaceValues(body: any): boolean;
    log(): void;
}
