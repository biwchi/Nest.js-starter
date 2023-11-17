import {
  Controller,
  FileTypeValidator,
  Get,
  Logger,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  StreamableFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ApiConsumes, ApiBody, ApiTags } from '@nestjs/swagger';
import { FilesUploadInterceptor } from './file-upload.interceptor';
import { createReadStream } from 'fs';
import { join } from 'path';

@Controller('file')
@ApiTags('Working with files')
export class FileController {
  /**
   * Get files
   */
  @Get()
  getFiles(@Param(':fileName') name: string) {
    const file = createReadStream(join(process.cwd(), 'package.json'));
    return new StreamableFile(file);
  }

  /**
   * Upload files
   */
  @Post()
  @UseInterceptors(
    FilesUploadInterceptor({ fieldName: 'files', path: 'bebra', maxCount: 5 }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  public upload(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000 * 1024 }),
          new FileTypeValidator({ fileType: 'image/png' }),
        ],
      }),
    )
    files: Express.Multer.File[],
  ): void {
    Logger.log(
      `Files ${files
        .map((file) => file.filename)
        .join(' ')} was successfully uploaded`,
      this.constructor.name,
    );
  }
}
