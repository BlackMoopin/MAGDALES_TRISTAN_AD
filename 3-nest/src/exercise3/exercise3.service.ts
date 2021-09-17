import { Injectable } from '@nestjs/common';

@Injectable()
export class Exercise3Service {
    hello(name: string){
        return "Hello Goodmorning! " + name + "!";
    }

    loopsTriangle(height:number){
        var string = '';

        for (var i = 0; i < height; i++) {
            string += '*';
            console.log(string);
        }
        return;
    }

    prime(num:number):string{
        var isComposite = 0;

        for (var i = 2; i < num / 2; i++) {
            if (num % i == 0) {
                isComposite = 1;
                break;
            }
        }

        if (num < 1) {
            return ("Please enter a number greater than 0.");
        } else if (num == 1) {
            return (num + " is a neither a prime nor a composite number.");
        } else {
            if (isComposite == 1) {
                return (num + " is a not a prime number.");
            } else {
                return (num + " is a prime  number.");
            }
        }
        
    }
}
