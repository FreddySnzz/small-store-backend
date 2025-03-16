import { MigrationInterface, QueryRunner } from "typeorm";

export class InsertStatusData1741904101112 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO public.status(id, name)	VALUES (1, 'Pending');
            INSERT INTO public.status(id, name)	VALUES (2, 'Done');
            INSERT INTO public.status(id, name)	VALUES (3, 'Canceled');
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE * FROM public.status;
        `);
    }

}
