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

  // 클라이언트에서 name, rrn(주민번호 13자리 또는 6-7 형식), email, pwPattern 을 전송
  @Post('analyze')
  async analyze(@Body() body: { name: string; rrn: string; email: string; pwPattern: string }) {
    return await this.diagnosticService.analyzeAndLog(body);
  }
}