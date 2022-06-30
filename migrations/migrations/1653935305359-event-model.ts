import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class EventModel1653935305359 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        return queryRunner.createTable(
            new Table({
              name: 'Event',
              columns: [
                { name: 'id', type: 'int', isPrimary: true, generationStrategy: 'increment', isGenerated: true },
                { name: 'diaryId', type: 'int' },
                { name: 'userIdCarer', type: 'int' },
                { name: 'userIdCare', type: 'int' },
                { name: 'day', type: 'int' },
                { name: 'startTime', type: 'varchar' },
                { name: 'endTime', type: 'varchar' },
                { name: 'expirationDate', type: 'Date' },
                { name: 'notes', type: 'varchar' }
              ]
            })
          );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        return queryRunner.dropTable('Diary');
    }

}

