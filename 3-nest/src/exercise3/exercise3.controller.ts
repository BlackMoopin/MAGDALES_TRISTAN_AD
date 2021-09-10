import { Controller, Get, Param } from '@nestjs/common';
import { Exercise3Service } from './exercise3.service';

@Controller('exercise3')
export class Exercise3Controller {
    constructor(private readonly e3: Exercise3Service){}

    @Get("/hello/:name")
    getHello(@Param('name') name:string): string {
        return this.e3.hello(name);
    }

    @Get("/loopsTriangle/:height")
    loopsTriangle(@Param('height') height:string) {
        var parsedHeight = parseInt(height);
        return this.e3.loopsTriangle(parsedHeight);
    }

    @Get("/prime/:num")
    prime(@Param('num') num:string) {
        var parsedNum = parseInt(num);
        return this.e3.prime(parsedNum);
    }
}
