import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1683276869110 implements MigrationInterface {
    name = 'Init1683276869110'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "fish" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fishId" character varying NOT NULL, "deleted" boolean NOT NULL DEFAULT false, "length" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "ownerId" character varying, CONSTRAINT "PK_6ffb9180fd59d279a93e2a6f786" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" character varying NOT NULL, "username" character varying NOT NULL, "avatar" character varying NOT NULL, "money" integer NOT NULL, "exp" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "facility" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "facilityId" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "placeId" uuid, CONSTRAINT "PK_07c6c82781d105a680b5c265be6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "place" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "cleans" integer NOT NULL DEFAULT '0', "exp" integer NOT NULL DEFAULT '0', "capital" integer NOT NULL DEFAULT '0', "description" character varying NOT NULL DEFAULT '', "season" integer NOT NULL DEFAULT '0', "biome" integer NOT NULL DEFAULT '1', "price" integer NOT NULL DEFAULT '0', "fee" integer NOT NULL DEFAULT '5', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_96ab91d43aa89c5de1b59ee7cca" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "fish" ADD CONSTRAINT "FK_68b2431e779018e8245809e03d1" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "facility" ADD CONSTRAINT "FK_7e4e1a54ccb8a68ab84153d3150" FOREIGN KEY ("placeId") REFERENCES "place"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "facility" DROP CONSTRAINT "FK_7e4e1a54ccb8a68ab84153d3150"`);
        await queryRunner.query(`ALTER TABLE "fish" DROP CONSTRAINT "FK_68b2431e779018e8245809e03d1"`);
        await queryRunner.query(`DROP TABLE "place"`);
        await queryRunner.query(`DROP TABLE "facility"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "fish"`);
    }

}
