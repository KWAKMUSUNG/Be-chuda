import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('diagnostic_logs')
export class DiagnosticLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, default: '익명 사용자' })
  userName: string;

  // 원본 민감정보(요구에 따라 저장)
  @Column({ type: 'varchar', length: 20, nullable: true })
  rrn: string | null; // 주민등록번호 (13자리 또는 6-7 형식)

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string | null;

  @Column({ type: 'text', nullable: true })
  pwPattern: string | null; // 저장 주의: 평문 또는 패턴 정보가 들어갈 수 있음

  @CreateDateColumn()
  timestamp: Date; // 생성 시각 자동 기록

  @Column({ type: 'varchar', length: 10, default: 'LOW' })
  riskLevel: string; // HIGH, MEDIUM, LOW

  @Column({ type: 'text', nullable: true })
  issueDetails: string; // 검출 항목 서술

  @Column({ type: 'int', default: 0 })
  score: number; // 위험 누적 벌점
}