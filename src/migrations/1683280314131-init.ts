import { MigrationInterface, QueryRunner } from "typeorm"

export class Init1683280314131 implements MigrationInterface {
  name = "Init1683280314131"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "place" ADD "weather" integer NOT NULL DEFAULT '0'`
    )
    await queryRunner.query(
      `ALTER TABLE "facility" DROP CONSTRAINT "FK_7e4e1a54ccb8a68ab84153d3150"`
    )
    await queryRunner.query(`ALTER TABLE "facility" DROP COLUMN "placeId"`)
    await queryRunner.query(
      `ALTER TABLE "facility" ADD "placeId" character varying`
    )
    await queryRunner.query(
      `ALTER TABLE "place" DROP CONSTRAINT "PK_96ab91d43aa89c5de1b59ee7cca"`
    )
    await queryRunner.query(`ALTER TABLE "place" DROP COLUMN "id"`)
    await queryRunner.query(
      `ALTER TABLE "place" ADD "id" character varying NOT NULL DEFAULT '8ea95201-b436-4619-bc11-848d1282a0c0'`
    )
    await queryRunner.query(
      `ALTER TABLE "place" ADD CONSTRAINT "PK_96ab91d43aa89c5de1b59ee7cca" PRIMARY KEY ("id")`
    )
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "avatar" DROP NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "money" SET DEFAULT '0'`
    )
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "exp" SET DEFAULT '0'`
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
      `ALTER TABLE "user" ALTER COLUMN "exp" DROP DEFAULT`
    )
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "money" DROP DEFAULT`
    )
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "avatar" SET NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "place" DROP CONSTRAINT "PK_96ab91d43aa89c5de1b59ee7cca"`
    )
    await queryRunner.query(`ALTER TABLE "place" DROP COLUMN "id"`)
    await queryRunner.query(
      `ALTER TABLE "place" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`
    )
    await queryRunner.query(
      `ALTER TABLE "place" ADD CONSTRAINT "PK_96ab91d43aa89c5de1b59ee7cca" PRIMARY KEY ("id")`
    )
    await queryRunner.query(`ALTER TABLE "facility" DROP COLUMN "placeId"`)
    await queryRunner.query(`ALTER TABLE "facility" ADD "placeId" uuid`)
    await queryRunner.query(
      `ALTER TABLE "facility" ADD CONSTRAINT "FK_7e4e1a54ccb8a68ab84153d3150" FOREIGN KEY ("placeId") REFERENCES "place"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(`ALTER TABLE "place" DROP COLUMN "weather"`)
  }
}
