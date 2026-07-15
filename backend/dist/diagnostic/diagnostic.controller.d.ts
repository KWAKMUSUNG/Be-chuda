import { DiagnosticService } from './diagnostic.service';
export declare class DiagnosticController {
    private readonly diagnosticService;
    constructor(diagnosticService: DiagnosticService);
    getSamples(): {
        id: number;
        type: string;
        content: string;
    }[];
    getLogs(): Promise<import("./entities/diagnostic-log.entity").DiagnosticLog[]>;
    analyze(body: {
        realName: string;
        ssn: string;
        email: string;
        password: string;
    }): Promise<{
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
        log: import("./entities/diagnostic-log.entity").DiagnosticLog;
    }>;
}
