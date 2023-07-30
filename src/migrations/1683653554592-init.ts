import { MigrationInterface, QueryRunner } from "typeorm"

export class Init1683653554592 implements MigrationInterface {
  name = "Init1683653554592"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "o_auth2_client" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "redirectUris" text array NOT NULL DEFAULT '{}', "secret" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_952c295128af7ed3206ecc1b555" PRIMARY KEY ("id"))`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "o_auth2_client"`)
  }
}
