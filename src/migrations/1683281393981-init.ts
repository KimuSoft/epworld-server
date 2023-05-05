import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1683281393981 implements MigrationInterface {
    name = 'Init1683281393981'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "admin" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "facility" DROP CONSTRAINT "FK_7e4e1a54ccb8a68ab84153d3150"`);
        await queryRunner.query(`ALTER TABLE "place" ALTER COLUMN "id" SET DEFAULT '6fb80ce2-8795-4c5e-a0b0-73b5fd54d7a4'`);
        await queryRunner.query(`ALTER TABLE "facility" ADD CONSTRAINT "FK_7e4e1a54ccb8a68ab84153d3150" FOREIGN KEY ("placeId") REFERENCES "place"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "facility" DROP CONSTRAINT "FK_7e4e1a54ccb8a68ab84153d3150"`);
        await queryRunner.query(`ALTER TABLE "place" ALTER COLUMN "id" SET DEFAULT '8ea95201-b436-4619-bc11-848d1282a0c0'`);
        await queryRunner.query(`ALTER TABLE "facility" ADD CONSTRAINT "FK_7e4e1a54ccb8a68ab84153d3150" FOREIGN KEY ("placeId") REFERENCES "place"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "admin"`);
    }

}
