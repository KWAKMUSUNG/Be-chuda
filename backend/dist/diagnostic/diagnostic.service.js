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
exports.DiagnosticService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const diagnostic_log_entity_1 = require("./entities/diagnostic-log.entity");
const leak_database_entity_1 = require("./entities/leak-database.entity");
const vulnerability_template_entity_1 = require("./entities/vulnerability-template.entity");
const mock_db_1 = require("../mock-db");
let DiagnosticService = class DiagnosticService {
    diagnosticRepository;
    leakRepository;
    templateRepository;
    constructor(diagnosticRepository, leakRepository, templateRepository) {
        this.diagnosticRepository = diagnosticRepository;
        this.leakRepository = leakRepository;
        this.templateRepository = templateRepository;
    }
    getAllSamples() {
        return mock_db_1.mockTextSamples;
    }
    async getRecentLogs() {
        return await this.diagnosticRepository.find({
            order: { timestamp: 'DESC' },
            take: 20,
        });
    }
    async analyzeAndLog(payload) {
        const realName = (payload.realName || '').trim();
        const ssn = (payload.ssn || '').trim();
        const email = (payload.email || '').trim().toLowerCase();
        const password = payload.password || '';
        const exactLeak = realName && ssn
            ? await this.leakRepository.findOne({ where: { name: realName, rrn: ssn } })
            : null;
        let score = 0;
        let riskLevel = '안전';
        let issueDetails = '현재까지 유출 위험이 검출되지 않았습니다.';
        let vulnerabilities = [];
        const loginAttempts = [];
        let exposedServices = [];
        if (exactLeak) {
            score = 100;
            riskLevel = '위험';
            issueDetails = `이름과 주민번호가 유출 DB와 일치합니다. 유출 출처: ${exactLeak.leakSource}`;
            vulnerabilities = await this.templateRepository.find({ where: { severity: 'HIGH' }, take: 2 });
            loginAttempts.push({
                timestamp: new Date().toISOString(),
                success: false,
                source: '로그인 시도',
                note: '유출된 주민번호와 일치하는 로그인 시도 패턴이 발견되었습니다.',
            }, {
                timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
                success: false,
                source: '외부 접근',
                note: '동일한 계정 정보로 여러 차례 접근 시도가 있었습니다.',
            });
            exposedServices = ['포털 서비스', 'SNS', '금융 앱'];
        }
        else {
            const leakedByEmail = email
                ? await this.leakRepository.findOne({ where: { email } })
                : null;
            const detectedPatterns = [];
            const normalizedSsn = ssn.replace(/-/g, '');
            if (normalizedSsn && password.includes(normalizedSsn)) {
                detectedPatterns.push('비밀번호에 주민번호 패턴 포함');
            }
            if (realName && password.includes(realName)) {
                detectedPatterns.push('비밀번호에 이름 포함');
            }
            const localEmailPart = email.split('@')[0];
            if (localEmailPart && password.includes(localEmailPart)) {
                detectedPatterns.push('비밀번호에 이메일 아이디 포함');
            }
            if (leakedByEmail || detectedPatterns.length > 0) {
                vulnerabilities = await this.templateRepository.find({ where: { severity: 'MEDIUM' } });
                if (leakedByEmail) {
                    score = 60;
                    riskLevel = '경고';
                    issueDetails = `이메일이 유출 DB와 일치합니다. 유출 출처: ${leakedByEmail.leakSource}`;
                }
                if (!leakedByEmail && detectedPatterns.length > 0) {
                    score = 50;
                    riskLevel = '주의';
                    issueDetails = `${detectedPatterns.join(', ')} 검출되었습니다.`;
                }
                if (leakedByEmail && detectedPatterns.length > 0) {
                    issueDetails = `이메일이 유출 DB와 일치하고, ${detectedPatterns.join(', ')} 검출되었습니다.`;
                }
                loginAttempts.push({
                    timestamp: new Date().toISOString(),
                    success: false,
                    source: '이메일 기반 로그인',
                    note: leakedByEmail
                        ? '유출된 이메일 주소가 확인되었습니다.'
                        : '비밀번호 패턴에서 민감정보 노출이 감지되었습니다.',
                });
                exposedServices = ['이메일 서비스', '온라인 쇼핑', '클라우드 저장소'];
            }
            else {
                score = 5;
                riskLevel = '안전';
                issueDetails = '현재까지 유출 위험이 검출되지 않았습니다.';
                vulnerabilities = await this.templateRepository.find({ where: { severity: 'LOW' } });
                loginAttempts.push({
                    timestamp: new Date().toISOString(),
                    success: true,
                    source: '정상 로그인',
                    note: '이상 징후가 발견되지 않았습니다.',
                });
                exposedServices = ['기본 웹 브라우징', '기본 이메일 서비스'];
            }
        }
        const newLog = this.diagnosticRepository.create({
            userName: realName || '익명 사용자',
            riskLevel,
            issueDetails,
            score,
        });
        const savedLog = await this.diagnosticRepository.save(newLog);
        return {
            userName: realName || '익명 사용자',
            riskLevel,
            score,
            issueDetails,
            vulnerabilities,
            loginAttempts,
            exposedServices,
            log: savedLog,
        };
    }
};
exports.DiagnosticService = DiagnosticService;
exports.DiagnosticService = DiagnosticService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(diagnostic_log_entity_1.DiagnosticLog)),
    __param(1, (0, typeorm_1.InjectRepository)(leak_database_entity_1.LeakDatabase)),
    __param(2, (0, typeorm_1.InjectRepository)(vulnerability_template_entity_1.VulnerabilityTemplate)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], DiagnosticService);
//# sourceMappingURL=diagnostic.service.js.map