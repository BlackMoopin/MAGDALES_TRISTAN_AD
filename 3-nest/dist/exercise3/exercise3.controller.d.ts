import { Exercise3Service } from './exercise3.service';
export declare class Exercise3Controller {
    private readonly e3;
    constructor(e3: Exercise3Service);
    getHello(name: string): string;
    loopsTriangle(height: string): void;
    prime(num: string): string;
}
