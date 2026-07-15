import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiagnosticModule } from './diagnostic/diagnostic.module';
import { DiagnosticLog } from './diagnostic/entities/diagnostic-log.entity';
import { LeakDatabase } from './diagnostic/entities/leak-database.entity';
import { VulnerabilityTemplate } from './diagnostic/entities/vulnerability-template.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'your_password', // 👈 본인의 MariaDB root 비밀번호를 입력하세요!
      database: 'be_chuda_db',
      entities: [DiagnosticLog, LeakDatabase, VulnerabilityTemplate],
      synchronize: true, // 개발 단계이므로 엔티티 기준 테이블 자동 생성(시연 최적화)
    }),
    DiagnosticModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}