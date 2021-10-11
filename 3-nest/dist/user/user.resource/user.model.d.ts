import { CRUDReturn } from './crud_return.interface';
export declare class User {
    id: string;
    private name;
    private age;
    private email;
    private password;
    constructor(name: string, age: number, email: string, password: string);
    login(password: string): CRUDReturn;
    toJson(): {
        id: string;
        name: string;
        age: number;
        email: string;
    };
}
