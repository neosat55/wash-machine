import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'node:process';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

try {
  process.loadEnvFile('./.env');
} catch (exception) {
  console.log(`Cannot read env: `, exception);
}

const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || 'localhost';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();
  app.setGlobalPrefix('api');

  app.useStaticAssets(join(__dirname, '..', 'public'));

  if (process.env.SWAGGER === 'true') {
    const config = new DocumentBuilder()
      .setTitle('WachMachine API docs')
      .setVersion('1.0')
      .addBearerAuth()
      .addServer(`http://${HOST}:${PORT}`)
      .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('api/docs', app, document);
  }

  await app.listen(PORT, () => {
    console.log(`http://${HOST}:${PORT}`);
  });
}
bootstrap();
