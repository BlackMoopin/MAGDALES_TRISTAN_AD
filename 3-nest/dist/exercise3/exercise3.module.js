"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Exercise3Module = void 0;
const common_1 = require("@nestjs/common");
const exercise3_controller_1 = require("./exercise3.controller");
const exercise3_service_1 = require("./exercise3.service");
let Exercise3Module = class Exercise3Module {
};
Exercise3Module = __decorate([
    (0, common_1.Module)({
        controllers: [exercise3_controller_1.Exercise3Controller],
        providers: [exercise3_service_1.Exercise3Service]
    })
], Exercise3Module);
exports.Exercise3Module = Exercise3Module;
//# sourceMappingURL=exercise3.module.js.map