import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1683282520099 implements MigrationInterface {
    name = 'Init1683282520099'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "place" ADD "ownerId" character varying`);
        await queryRunner.query(`ALTER TABLE "facility" DROP CONSTRAINT "FK_7e4e1a54ccb8a68ab84153d3150"`);
        await queryRunner.query(`ALTER TABLE "place" ALTER COLUMN "id" SET DEFAULT '99ebe55d-ff6f-4279-b816-3ff38e38ff99'`);
        await queryRunner.query(`ALTER TABLE "place" ADD CONSTRAINT "FK_8158c413778562971d02cf8336f" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "facility" ADD CONSTRAINT "FK_7e4e1a54ccb8a68ab84153d3150" FOREIGN KEY ("placeId") REFERENCES "place"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "facility" DROP CONSTRAINT "FK_7e4e1a54ccb8a68ab84153d3150"`);
        await queryRunner.query(`ALTER TABLE "place" DROP CONSTRAINT "FK_8158c413778562971d02cf8336f"`);
        await queryRunner.query(`ALTER TABLE "place" ALTER COLUMN "id" SET DEFAULT '6fb80ce2-8795-4c5e-a0b0-73b5fd54d7a4'`);
        await queryRunner.query(`ALTER TABLE "facility" ADD CONSTRAINT "FK_7e4e1a54ccb8a68ab84153d3150" FOREIGN KEY ("placeId") REFERENCES "place"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "place" DROP COLUMN "ownerId"`);
    }

}
