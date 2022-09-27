import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CarerUsers1657043287297 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        return queryRunner.createTable(
          new Table({
            name: 'Carers',
            columns: [
              { name: 'id', type: 'int', isPrimary: true, generationStrategy: 'increment', isGenerated: true },
              { name: 'userId', type: 'int'},
              { name: 'amountCare', type: 'int'},
              { name: 'price', type: 'int'},
              { name: 'specialty', type: 'int'},
              { name: 'isNurse', type: 'int'}, 
              { name: 'experience', type: 'varchar', isNullable: true},
              { name: 'latitudeCurrent', type: 'varchar', isNullable: true },
              { name: 'longitudeCurrent', type: 'varchar', isNullable: true }
            ]
          })
        );
      }

    public async down(queryRunner: QueryRunner): Promise<any> {
        return queryRunner.dropTable('Carers');
    }

}
