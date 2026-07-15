import { Controller, Get, Post, Body } from '@nestjs/common';
import { DiagnosticService } from './diagnostic.service';

@Controller('diagnostic')
export class DiagnosticController {
  constructor(private readonly diagnosticService: DiagnosticService) {}

  @Get('samples')
  getSamples() {
    return this.diagnosticService.getAllSamples();
  }

  @Get('logs')
  async getLogs() {
    return await this.diagnosticService.getRecentLogs();
  }

  // 클라이언트에서 realName, ssn, email, password 를 전송
  @Post('analyze')
  async analyze(
    @Body()
    body: { realName: string; ssn: string; email: string; password: string },
  ) {
    return await this.diagnosticService.analyzeAndLog(body);
  }
}