import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class DiaryModel1653933190249 implements MigrationInterface {

    public up(queryRunner: QueryRunner): Promise<void> {
      return queryRunner.createTable(
          new Table({
            name: 'Diary',
            columns: [
              { name: 'userIdCarer', type: 'int', isPrimary: true },
              { name: 'events', type: 'int' }
            ]
          })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      return queryRunner.dropTable('Diary');
    }

}
