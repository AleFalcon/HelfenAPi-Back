import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class services1660160244364 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        return queryRunner.createTable(
          new Table({
              name: 'Services',
              columns: [
                { name: 'description', type: 'varchar', isPrimary: true },
                { name: 'carer', type: 'int', isPrimary: true },
              ]
            })
            );
      }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
