import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterCategoryTable1741983729168 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            ALTER TABLE "category"
                ADD enabled boolean NOT NULL DEFAULT true;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            ALTER TABLE "category"
                DROP enabled;
        `);
    }

}
