import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCategoryToAsset1710734400000 implements MigrationInterface {
  name = 'AddCategoryToAsset1710734400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "asset" ADD "category" varchar(50) NOT NULL DEFAULT 'other'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "asset" DROP COLUMN "category"`);
  }
} 