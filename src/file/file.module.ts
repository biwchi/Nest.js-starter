import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [],
  controllers: [FileController],
  providers: [ConfigService],
})
export class FileModule {}
