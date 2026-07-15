import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiagnosticLog } from './entities/diagnostic-log.entity';
import { mockTextSamples } from '../mock-db'; // 샘플 본문은 파일에 그대로 유지

@Injectable()
export class DiagnosticService {
  constructor(
    @InjectRepository(DiagnosticLog)
    private readonly diagnosticRepository: Repository<DiagnosticLog>,
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

  // 3. 클라이언트에서 전달된 입력(이름, 주민번호, 이메일, 패스워드 패턴)을 분석하고 DB에 저장
  async analyzeAndLog(payload: { name?: string; rrn?: string; email?: string; pwPattern?: string }) {
    const detections: string[] = [];
    let score = 0;

    const rrnRaw = (payload.rrn || '').trim();
    const pw = payload.pwPattern || '';

    // 정규식: 주민등록번호 (6-7 또는 13자리), 이메일
    const rrnRegex = /^(?:\d{6}-\d{7}|\d{13})$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // 주민번호 제공 여부 및 형식 검사
    if (rrnRaw) {
      if (rrnRegex.test(rrnRaw)) {
        detections.push('주민등록번호(제공/형식확인)');
        score += 50;
      } else {
        detections.push('주민등록번호(형식 불일치)');
        score += 30;
      }
    }

    // 이메일 제공 여부
    if (payload.email) {
      if (emailRegex.test(payload.email.trim())) {
        detections.push('이메일(제공)');
        score += 10;
      } else {
        detections.push('이메일(형식 불일치)');
        score += 5;
      }
    }

    // 패스워드 패턴 검사: 주민번호/이름 포함 여부, 길이 약함 등
    if (pw) {
      // 주민번호가 하이픈 없이 전달된 경우 비교를 위해 모두 제거해서 검사
      const rrnNormalized = rrnRaw.replace(/-/g, '');
      if (rrnNormalized && pw.includes(rrnNormalized)) {
        detections.push('패스워드에 주민번호 포함');
        score += 40;
      }
      if (payload.name && pw.includes(payload.name)) {
        detections.push('패스워드에 이름 포함');
        score += 20;
      }
      if (pw.length < 8) {
        detections.push('약한 패스워드(길이<8)');
        score += 20;
      }
    }

    const issueDetails = detections.length > 0 ? `${detections.join(', ')} 검출` : '검출된 개인정보 없음';
    const riskLevel = score >= 50 ? 'HIGH' : score >= 10 ? 'MEDIUM' : 'LOW';

    // DB에 새 엔티티 인스턴스 만들고 저장 (요청에 포함된 원본 필드도 저장)
    const newLog = this.diagnosticRepository.create({
      userName: payload.name || '익명 사용자',
      rrn: rrnRaw || null,
      email: payload.email || null,
      pwPattern: payload.pwPattern || null,
      riskLevel,
      issueDetails,
      score,
    });

    const savedLog = await this.diagnosticRepository.save(newLog);

    return {
      log: savedLog,
      score,
      detections,
    };
  }
}