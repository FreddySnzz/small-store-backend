import { MigrationInterface, QueryRunner } from "typeorm";

export class InsertAdminUser1741902540779 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            INSERT INTO public."user"(
                name, email, password, phone, user_type, enabled)
                VALUES (
                    'root', 
                    'admin@root.com', 
                    '$2b$10$Z5O8SkC5P0ImHOZM8zUBQ.yVM3VnpbZTx5Yuz27rN2mEUljdI7ZR2', 
                    '86900001234', 
                    1, 
                    true
                );
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            DELETE FROM public."user"
                WHERE email like 'admin@root.com';
        `)
    }

}
