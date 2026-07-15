// src/mock-db.ts

// 1. 개인정보 포함 여부를 테스트할 가짜 텍스트 샘플
export const mockTextSamples = [
  { id: 1, type: 'NORMAL', content: '오늘 날씨가 정말 좋네요. 프로젝트 일정 확인 부탁드립니다.' },
  { id: 2, type: 'EMAIL', content: '연락처는 gildong.hong@testmail.com 으로 주시면 됩니다.' },
  { id: 3, type: 'PHONE', content: '긴급 연락처는 010-1234-5678 입니다.' },
  { id: 4, type: 'SSN', content: '본인 확인을 위해 주민번호 981024-1234567을 입력했습니다.' },
  { id: 5, type: 'MIXED', content: '문의사항은 010-9999-8888로 전화주시고, 메일은 hong@example.com입니다.' },
];

// 2. 가상 진단 이력 로그 10개 세트
export const mockDiagnosticLogs = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  userName: `테스트사용자${i + 1}`,
  timestamp: new Date(Date.now() - i * 3600000).toISOString(),
  riskLevel: i % 3 === 0 ? 'HIGH' : i % 3 === 1 ? 'MEDIUM' : 'LOW',
  issueDetails: i % 2 === 0 ? '주민번호 패턴 검출' : '이메일 주소 노출',
}));
