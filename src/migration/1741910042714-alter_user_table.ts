import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterUserTable1741910042714 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            ALTER TABLE "user"
                ADD token varchar(6) NOT NULL DEFAULT '0';
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            ALTER TABLE "user"
                DROP token;
        `);
    }

}
