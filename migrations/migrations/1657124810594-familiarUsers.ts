import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class FamiliarUsers1657124810594 implements MigrationInterface {

    public up(queryRunner: QueryRunner): Promise<void> {
        return queryRunner.createTable(
          new Table({
            name: 'Familiars',
            columns: [
              { name: 'id', type: 'int', isPrimary: true, generationStrategy: 'increment', isGenerated: true },
              { name: 'userId', type: 'int'},
            ]
          })
        );
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        return queryRunner.dropTable('Familiars');
      }

}
