import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1691020675263 implements MigrationInterface {
    name = 'Init1691020675263'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "recentPlaceId" character varying`);
        await queryRunner.query(`ALTER TABLE "place" ADD "publicity" integer NOT NULL DEFAULT '2'`);
        await queryRunner.query(`ALTER TABLE "place" ADD "placeType" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "place" ADD "deletedAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "place" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "place" DROP COLUMN "placeType"`);
        await queryRunner.query(`ALTER TABLE "place" DROP COLUMN "publicity"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "recentPlaceId"`);
    }

}
