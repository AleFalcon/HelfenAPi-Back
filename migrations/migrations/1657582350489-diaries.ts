import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class diaries1657582350489 implements MigrationInterface {

    public up(queryRunner: QueryRunner): Promise<void> {
        return queryRunner.createTable(
            new Table({
              name: 'Diaries',
              columns: [
                { name: 'id', type: 'int', isPrimary: true },
                { name: 'eventId', type: 'int', isPrimary: true }
              ]
            })
          );
      }
  
      public async down(queryRunner: QueryRunner): Promise<void> {
        return queryRunner.dropTable('Diaries');
      }

}
