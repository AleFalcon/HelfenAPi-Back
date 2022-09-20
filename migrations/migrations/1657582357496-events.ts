import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class Events1657582357496 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        return queryRunner.createTable(
            new Table({
              name: 'Events',
              columns: [
                { name: 'id', type: 'int', isPrimary: true, generationStrategy: 'increment', isGenerated: true },
                { name: 'day', type: 'int' },
                { name: 'carer', type: 'int' },
                { name: 'date', type: 'Date' },
                { name: 'startEvent', type: 'varchar' },
                { name: 'endEvent', type: 'varchar' },
                { name: 'expirationDate', type: 'Date', isNullable: true },
                { name: 'notes', type: 'varchar', isNullable: true  },
                { name: 'localAddress', type: 'varchar' },
                { name: 'status', type: 'boolean' },
                { name: 'familiar', type: 'int' }
              ]
            })
          );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        return queryRunner.dropTable('Events');
    }

}
