import { ConfigService } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';

type BuildDataSourceOptions = {
  entities: string[];
  logging: boolean;
};

function buildDataSource(
  configService: ConfigService,
  options: BuildDataSourceOptions,
): DataSourceOptions {
  const { entities, logging } = options;

  return {
    type: 'postgres',
    host: configService.get('POSTGRES_HOST'),
    port: Number(configService.get<number>('POSTGRES_PORT')),
    username: configService.get('POSTGRES_USER'),
    password: configService.get('POSTGRES_PASSWORD'),
    database: configService.get('POSTGRES_DB'),
    entities,
    migrations: ['dist/migrator/migrations/*{.ts,.js}'],
    synchronize: false,
    logging,
    cache: false,
  };
}

export function dataSourceFactory(configService: ConfigService) {
  return buildDataSource(configService, {
    entities: ['dist/**/*.entity.js'],
    logging: true,
  });
}

export function dataSourceTestFactory(configService: ConfigService) {
  return buildDataSource(configService, {
    entities: ['dist/**/*.entity.js'],
    logging: false,
  });
}
