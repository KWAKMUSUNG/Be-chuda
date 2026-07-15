import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiagnosticLog } from './entities/diagnostic-log.entity';
import { LeakDatabase } from './entities/leak-database.entity';
import { VulnerabilityTemplate } from './entities/vulnerability-template.entity';
import { mockTextSamples } from '../mock-db';

type DiagnosticRequest = {
  realName: string;
  ssn: string;
  email: string;
  password: string;
};

@Injectable()
export class DiagnosticService {
  constructor(
    @InjectRepository(DiagnosticLog)
    private readonly diagnosticRepository: Repository<DiagnosticLog>,
    @InjectRepository(LeakDatabase)
    private readonly leakRepository: Repository<LeakDatabase>,
    @InjectRepository(VulnerabilityTemplate)
    private readonly templateRepository: Repository<VulnerabilityTemplate>,
  ) {}

  // 1. 테스트용 샘플 본문 데이터 반환 (화면 편의용)
  getAllSamples() {
    return mockTextSamples;
  }

  // 2. 실제 DB에서 최신 진단 이력 로그 20개 조회
  async getRecentLogs() {
    return await this.diagnosticRepository.find({
      order: { timestamp: 'DESC' },
      take: 20,
    });
  }

  // 3. 클라이언트에서 전달된 입력(실명, 주민번호, 이메일, 패스워드)을 대조하고 로그로 저장
  async analyzeAndLog(payload: DiagnosticRequest) {
    const realName = (payload.realName || '').trim();
    const ssn = (payload.ssn || '').trim();
    const email = (payload.email || '').trim().toLowerCase();
    const password = payload.password || '';

    const exactLeak = realName && ssn
      ? await this.leakRepository.findOne({ where: { name: realName, rrn: ssn } })
      : null;

    let score = 0;
    let riskLevel: '위험' | '경고' | '주의' | '안전' = '안전';
    let issueDetails = '현재까지 유출 위험이 검출되지 않았습니다.';
    let vulnerabilities: VulnerabilityTemplate[] = [];
    const loginAttempts: Array<{ timestamp: string; success: boolean; source: string; note: string }> = [];
    let exposedServices: string[] = [];

    if (exactLeak) {
      score = 100;
      riskLevel = '위험';
      issueDetails = `이름과 주민번호가 유출 DB와 일치합니다. 유출 출처: ${exactLeak.leakSource}`;
      vulnerabilities = await this.templateRepository.find({ where: { severity: 'HIGH' }, take: 2 });
      loginAttempts.push(
        {
          timestamp: new Date().toISOString(),
          success: false,
          source: '로그인 시도',
          note: '유출된 주민번호와 일치하는 로그인 시도 패턴이 발견되었습니다.',
        },
        {
          timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
          success: false,
          source: '외부 접근',
          note: '동일한 계정 정보로 여러 차례 접근 시도가 있었습니다.',
        },
      );
      exposedServices = ['포털 서비스', 'SNS', '금융 앱'];
    } else {
      const leakedByEmail = email
        ? await this.leakRepository.findOne({ where: { email } })
        : null;

      const detectedPatterns: string[] = [];
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

        loginAttempts.push(
          {
            timestamp: new Date().toISOString(),
            success: false,
            source: '이메일 기반 로그인',
            note: leakedByEmail
              ? '유출된 이메일 주소가 확인되었습니다.'
              : '비밀번호 패턴에서 민감정보 노출이 감지되었습니다.',
          },
        );
        exposedServices = ['이메일 서비스', '온라인 쇼핑', '클라우드 저장소'];
      } else {
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
}