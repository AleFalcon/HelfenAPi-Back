import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class services1660160244364 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        return queryRunner.createTable(
          new Table({
              name: 'Services',
              columns: [
                { name: 'id', type: 'int', isPrimary: true, generationStrategy: 'increment', isGenerated: true },
                { name: 'description', type: 'varchar' },
                { name: 'carer', type: 'int' },
              ]
            })
            );
      }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
