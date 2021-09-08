import { Injectable } from '@nestjs/common';

@Injectable()
export class Exercise3Service {
    helloWorld(){
        console.log("Hilu Goodmorneng");
        return "Hilu Goodmorneng";
    }

    loopsTriangle(height:number){
        var string = '';

        for (var i = 0; i < height; i++) {
            string += '*';
            console.log(string);
        }

        return;
    }

    primeNumber(num:number):string{
        var isPrime = 0;

        for (var i = 2; i < num / 2; i++) {
            if (num % i == 0) {
                isPrime = 1;
                break;
            }
        }

        if (num < 1) {
            return ("Please enter a number greater than 0.");
        } else if (num == 1) {
            return (num + " is a not a prime number.");
        } else {
            if (isPrime == 1) {
                return (num + " is a not a prime number.");
            } else {
                return (num + " is a prime  number.");
            }
        }
        
    }
}
