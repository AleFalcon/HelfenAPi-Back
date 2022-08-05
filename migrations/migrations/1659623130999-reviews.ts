import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class Reviews1659623130999 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
      return queryRunner.createTable(
        new Table({
            name: 'Reviews',
            columns: [
              { name: 'id', type: 'int', isPrimary: true, generationStrategy: 'increment', isGenerated: true },
              { name: 'carer', type: 'int' },
              { name: 'familiar', type: 'int' },
              { name: 'comment', type: 'varchar', isNullable: true },
              { name: 'classification', type: 'int' },
            ]
          })
          );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        return queryRunner.dropTable('Reviews');
    }

}
