import { NestApplication, NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

import { AppModule } from './app.module';
import * as path from 'path';

import * as fs from 'fs';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

let appPort: number;

const appPrefix = 'api';
const docsPrefix = `${appPrefix}/docs`;

const createUploadsDir = (directory: string) => {
  const uloadsDir = path.join(process.cwd(), directory);

  if (fs.existsSync(uloadsDir)) {
    fs.mkdirSync(uloadsDir);
  }
};

function buildSwaggerDocs(app: NestApplication, prefix: string) {
  const config = new DocumentBuilder()
    .setTitle('Gallery')
    .setDescription('Application for storing and using media files')
    .setBasePath('api')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(prefix, app, document);
}

async function bootstrap() {
  const app = await NestFactory.create<NestApplication>(AppModule);

  const configService = app.get(ConfigService);

  app.enableCors();
  app.setGlobalPrefix(appPrefix);

  buildSwaggerDocs(app, docsPrefix);

  app.use((_, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Credentials', true);
    next();
  });

  createUploadsDir(configService.get('FILE_STORAGE'));

  appPort = configService.get<number>('PORT');

  await app.listen(appPort);
}

bootstrap().then(() => {
  Logger.log(`Application started on port ${appPort}`, 'Main');
  Logger.log(
    `API Documentation: http://localhost:${appPort}/${docsPrefix}`,
    'Main',
  );
});
