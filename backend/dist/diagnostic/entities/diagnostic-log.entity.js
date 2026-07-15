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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiagnosticLog = void 0;
const typeorm_1 = require("typeorm");
let DiagnosticLog = class DiagnosticLog {
    id;
    userName;
    rrn;
    email;
    pwPattern;
    timestamp;
    riskLevel;
    issueDetails;
    score;
};
exports.DiagnosticLog = DiagnosticLog;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], DiagnosticLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, default: '익명 사용자' }),
    __metadata("design:type", String)
], DiagnosticLog.prototype, "userName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", Object)
], DiagnosticLog.prototype, "rrn", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], DiagnosticLog.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], DiagnosticLog.prototype, "pwPattern", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], DiagnosticLog.prototype, "timestamp", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10, default: 'LOW' }),
    __metadata("design:type", String)
], DiagnosticLog.prototype, "riskLevel", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], DiagnosticLog.prototype, "issueDetails", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], DiagnosticLog.prototype, "score", void 0);
exports.DiagnosticLog = DiagnosticLog = __decorate([
    (0, typeorm_1.Entity)('diagnostic_logs')
], DiagnosticLog);
//# sourceMappingURL=diagnostic-log.entity.js.map