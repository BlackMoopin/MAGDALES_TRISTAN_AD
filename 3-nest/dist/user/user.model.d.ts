import { CRUDReturn } from "./crud_return.interface";
export declare class User {
    id: string;
    private name;
    private age;
    private email;
    private password;
    constructor(name: string, age: number, email: string, password: string, id?: string);
    static retrieve(id: string): Promise<User>;
    commit(): Promise<CRUDReturn>;
    log(): void;
    login(password: string): CRUDReturn;
    search(term: any): boolean;
    replaceAllValues(body: any): boolean;
    update(user: any): Promise<boolean>;
    matches(term: string): boolean;
    toJson(): {
        name: string;
        age: number;
        email: string;
        password: string;
    };
    toJsonID(): {
        id: string;
        name: string;
        age: number;
        email: string;
    };
}
