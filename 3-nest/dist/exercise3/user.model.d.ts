export declare class User {
    private id;
    private name;
    private age;
    private email;
    private password;
    constructor(id: number, name: string, age: number, email: string, password: string);
    login(email: string, password: string): void;
    toJson(): {
        id: number;
        name: string;
        age: number;
        email: string;
    };
}
