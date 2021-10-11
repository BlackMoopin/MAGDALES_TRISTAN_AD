"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Exercise3Controller = void 0;
const common_1 = require("@nestjs/common");
const exercise3_service_1 = require("./exercise3.service");
let Exercise3Controller = class Exercise3Controller {
    constructor(e3) {
        this.e3 = e3;
    }
    getHello(name) {
        return this.e3.hello(name);
    }
    loopsTriangle(height) {
        var parsedHeight = parseInt(height);
        return this.e3.loopsTriangle(parsedHeight);
    }
    prime(num) {
        var parsedNum = parseInt(num);
        return this.e3.prime(parsedNum);
    }
};
__decorate([
    (0, common_1.Get)("/hello/:name"),
    __param(0, (0, common_1.Param)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", String)
], Exercise3Controller.prototype, "getHello", null);
__decorate([
    (0, common_1.Get)("/loopsTriangle/:height"),
    __param(0, (0, common_1.Param)('height')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], Exercise3Controller.prototype, "loopsTriangle", null);
__decorate([
    (0, common_1.Get)("/prime/:num"),
    __param(0, (0, common_1.Param)('num')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], Exercise3Controller.prototype, "prime", null);
Exercise3Controller = __decorate([
    (0, common_1.Controller)('exercise3'),
    __metadata("design:paramtypes", [exercise3_service_1.Exercise3Service])
], Exercise3Controller);
exports.Exercise3Controller = Exercise3Controller;
//# sourceMappingURL=exercise3.controller.js.map