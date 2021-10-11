"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Exercise3Service = void 0;
const common_1 = require("@nestjs/common");
let Exercise3Service = class Exercise3Service {
    hello(name) {
        return "Hello Goodmorning! " + name + "!";
    }
    loopsTriangle(height) {
        var string = '';
        for (var i = 0; i < height; i++) {
            string += '*';
            console.log(string);
        }
        return;
    }
    prime(num) {
        var isComposite = 0;
        for (var i = 2; i < num / 2; i++) {
            if (num % i == 0) {
                isComposite = 1;
                break;
            }
        }
        if (num < 1) {
            return ("Please enter a number greater than 0.");
        }
        else if (num == 1) {
            return (num + " is a neither a prime nor a composite number.");
        }
        else {
            if (isComposite == 1) {
                return (num + " is a not a prime number.");
            }
            else {
                return (num + " is a prime  number.");
            }
        }
    }
};
Exercise3Service = __decorate([
    (0, common_1.Injectable)()
], Exercise3Service);
exports.Exercise3Service = Exercise3Service;
//# sourceMappingURL=exercise3.service.js.map