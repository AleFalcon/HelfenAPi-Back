import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class events1657582357496 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        return queryRunner.createTable(
            new Table({
              name: 'Events',
              columns: [
                { name: 'id', type: 'int', isPrimary: true, generationStrategy: 'increment', isGenerated: true },
                { name: 'day', type: 'int' },
                { name: 'startTime', type: 'varchar' },
                { name: 'endTime', type: 'varchar' },
                { name: 'expirationDate', type: 'Date' },
                { name: 'notes', type: 'varchar' },
                { name: 'localAddress', type: 'varchar' },
              ]
            })
          );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        return queryRunner.dropTable('Events');
    }

}
