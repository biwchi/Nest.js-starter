import { Injectable, NestInterceptor, Type, mixin } from '@nestjs/common';
import {
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express/multer';
import { diskStorage } from 'multer';
import { ConfigGetOptions, ConfigService } from '@nestjs/config';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import * as path from 'path';
import * as uuid4 from 'uuid4';
import * as fs from 'fs';

type FileUploadInterceptorOptions = {
  fieldName: string;
  path?: string;
  fileFilter?: MulterOptions['fileFilter'];
};

type FilesUploadInterceptorOptions = {
  maxCount?: number;
} & FileUploadInterceptorOptions;

function buildMulterConfig(
  configService: ConfigService,
  options: FileUploadInterceptorOptions,
) {
  const fileDest = configService.get('FILE_STORAGE') || 'uploads';
  const destination = path.join(__dirname, '..', fileDest, options.path || '');

  const multerOptions: MulterOptions = {
    storage: diskStorage({
      destination: (_, __, cb) => {
        if (!fs.existsSync(destination)) {
          fs.mkdirSync(destination);
        }

        cb(null, destination);
      },
      filename: (req, file, cb) => {
        cb(null, `${uuid4()}-${file.originalname.replace(/\s+/g, '_')}`);
      },
    }),
    fileFilter: options.fileFilter,
  };

  return multerOptions;
}

export function FileUploadInterceptor(
  options: FileUploadInterceptorOptions,
): Type<NestInterceptor> {
  @Injectable()
  class Interceptor implements NestInterceptor {
    fileInterceptor: NestInterceptor;

    constructor(configService: ConfigService) {
      const multer = buildMulterConfig(configService, options);

      this.fileInterceptor = new (FileInterceptor(options.fieldName, multer))();
    }

    intercept(...args: Parameters<NestInterceptor['intercept']>) {
      return this.fileInterceptor.intercept(...args);
    }
  }

  return mixin(Interceptor);
}

export function FilesUploadInterceptor(
  options: FilesUploadInterceptorOptions,
): Type<NestInterceptor> {
  @Injectable()
  class Interceptor implements NestInterceptor {
    filesInterceptor: NestInterceptor;

    constructor(configService: ConfigService) {
      const multer = buildMulterConfig(configService, options);

      this.filesInterceptor = new (FilesInterceptor(
        options.fieldName,
        options.maxCount,
        multer,
      ))();
    }

    intercept(...args: Parameters<NestInterceptor['intercept']>) {
      return this.filesInterceptor.intercept(...args);
    }
  }

  return mixin(Interceptor);
}
