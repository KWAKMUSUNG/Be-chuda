import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiagnosticController } from './diagnostic.controller';
import { DiagnosticService } from './diagnostic.service';
import { DiagnosticLog } from './entities/diagnostic-log.entity';
import { LeakDatabase } from './entities/leak-database.entity';
import { VulnerabilityTemplate } from './entities/vulnerability-template.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DiagnosticLog, LeakDatabase, VulnerabilityTemplate])],
  controllers: [DiagnosticController],
  providers: [DiagnosticService],
})
export class DiagnosticModule {}