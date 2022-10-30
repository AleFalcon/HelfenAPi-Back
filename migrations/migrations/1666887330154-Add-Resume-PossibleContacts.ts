import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddResumePossibleContacts1666887330154 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('PossibleContacts', new TableColumn({
            name: 'resume',
            type: 'varchar',
            isNullable: true
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
