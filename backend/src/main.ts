import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 간단한 개발/프로토타입 용 CORS 허용 (프론트엔드에서 localhost로 요청할 때 필요)
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
