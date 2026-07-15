import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class DiagnosticLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userName: string;

  @Column()
  riskLevel: string; // '위험' | '경고' | '주의' | '안전'

  @Column({ type: 'text' })
  issueDetails: string;

  @Column()
  score: number;

  @CreateDateColumn()
  timestamp: Date;
}