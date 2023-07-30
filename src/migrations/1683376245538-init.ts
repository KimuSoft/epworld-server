import { MigrationInterface, QueryRunner } from "typeorm"

export class Init1683376245538 implements MigrationInterface {
  name = "Init1683376245538"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "item" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "itemId" character varying NOT NULL, "length" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "ownerId" character varying, CONSTRAINT "PK_d3c0c71f23e7adcf952a1d13423" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `ALTER TABLE "facility" DROP CONSTRAINT "FK_7e4e1a54ccb8a68ab84153d3150"`
    )
    await queryRunner.query(
      `ALTER TABLE "place" ALTER COLUMN "id" DROP DEFAULT`
    )
    await queryRunner.query(
      `ALTER TABLE "item" ADD CONSTRAINT "FK_3b030ef7f2840a721547a3c492e" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "facility" ADD CONSTRAINT "FK_7e4e1a54ccb8a68ab84153d3150" FOREIGN KEY ("placeId") REFERENCES "place"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "facility" DROP CONSTRAINT "FK_7e4e1a54ccb8a68ab84153d3150"`
    )
    await queryRunner.query(
      `ALTER TABLE "item" DROP CONSTRAINT "FK_3b030ef7f2840a721547a3c492e"`
    )
    await queryRunner.query(
      `ALTER TABLE "place" ALTER COLUMN "id" SET DEFAULT '99ebe55d-ff6f-4279-b816-3ff38e38ff99'`
    )
    await queryRunner.query(
      `ALTER TABLE "facility" ADD CONSTRAINT "FK_7e4e1a54ccb8a68ab84153d3150" FOREIGN KEY ("placeId") REFERENCES "place"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(`DROP TABLE "item"`)
  }
}
