import { Repository } from 'typeorm';
import { DiagnosticLog } from './entities/diagnostic-log.entity';
import { LeakDatabase } from './entities/leak-database.entity';
import { VulnerabilityTemplate } from './entities/vulnerability-template.entity';
type DiagnosticRequest = {
    realName: string;
    ssn: string;
    email: string;
    password: string;
};
export declare class DiagnosticService {
    private readonly diagnosticRepository;
    private readonly leakRepository;
    private readonly templateRepository;
    constructor(diagnosticRepository: Repository<DiagnosticLog>, leakRepository: Repository<LeakDatabase>, templateRepository: Repository<VulnerabilityTemplate>);
    getAllSamples(): {
        id: number;
        type: string;
        content: string;
    }[];
    getRecentLogs(): Promise<DiagnosticLog[]>;
    analyzeAndLog(payload: DiagnosticRequest): Promise<{
        userName: string;
        riskLevel: "위험" | "경고" | "주의" | "안전";
        score: number;
        issueDetails: string;
        vulnerabilities: VulnerabilityTemplate[];
        loginAttempts: {
            timestamp: string;
            success: boolean;
            source: string;
            note: string;
        }[];
        exposedServices: string[];
        log: DiagnosticLog;
    }>;
}
export {};
