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
exports.DiagnosticController = void 0;
const common_1 = require("@nestjs/common");
const diagnostic_service_1 = require("./diagnostic.service");
let DiagnosticController = class DiagnosticController {
    diagnosticService;
    constructor(diagnosticService) {
        this.diagnosticService = diagnosticService;
    }
    getSamples() {
        return this.diagnosticService.getAllSamples();
    }
    async getLogs() {
        return await this.diagnosticService.getRecentLogs();
    }
    async analyze(body) {
        return await this.diagnosticService.analyzeAndLog(body);
    }
};
exports.DiagnosticController = DiagnosticController;
__decorate([
    (0, common_1.Get)('samples'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DiagnosticController.prototype, "getSamples", null);
__decorate([
    (0, common_1.Get)('logs'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DiagnosticController.prototype, "getLogs", null);
__decorate([
    (0, common_1.Post)('analyze'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DiagnosticController.prototype, "analyze", null);
exports.DiagnosticController = DiagnosticController = __decorate([
    (0, common_1.Controller)('diagnostic'),
    __metadata("design:paramtypes", [diagnostic_service_1.DiagnosticService])
], DiagnosticController);
//# sourceMappingURL=diagnostic.controller.js.map