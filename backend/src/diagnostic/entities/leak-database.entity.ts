import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class LeakDatabase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  rrn: string; // 주민등록번호

  @Column({ nullable: true })
  email: string;

  @Column()
  leakSource: string;
}