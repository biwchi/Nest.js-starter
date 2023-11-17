import { MigrationInterface, QueryRunner } from 'typeorm';
import { config } from 'dotenv';
import * as CryptoJs from 'crypto-js';

config();

export class Init1677233529112 implements MigrationInterface {
  private encryptPassword(password: string) {
    return CryptoJs.AES.encrypt(password, process.env.PRIVATE_KEY).toString();
  }

  public async up(queryRunner: QueryRunner) {
    await queryRunner.query('CREATE SCHEMA IF NOT EXISTS "usr"');

    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "usr"."user" (
				"id" SERIAL NOT NULL, 
				"email" character varying(200) NOT NULL, 
				"password" character varying(200) NOT NULL, 
				"name" character varying(300) NOT NULL, 
        "refresh_token" character varying(400),
				CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
			)`,
    );

    await queryRunner.query(
      `INSERT INTO usr."user" (email, "password", "name")
			VALUES 
			('root@gmail.com', '${this.encryptPassword('root')}', 'Root');`,
    );
  }

  public async down(queryRunner: QueryRunner) {
    await queryRunner.query('DROP TABLE "usr"."user"');
    await queryRunner.query('DROP SCHEMA "usr"');
  }
}
