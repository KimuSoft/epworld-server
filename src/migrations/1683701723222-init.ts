import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1683701723222 implements MigrationInterface {
    name = 'Init1683701723222'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "oauth2_client" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "redirectUris" text array NOT NULL DEFAULT '{}', "secret" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0a9e91cfe1ec5d4c773961c76c4" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "oauth2_client"`);
    }

}
