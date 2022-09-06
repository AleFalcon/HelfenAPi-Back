import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class possibleContacts1661981794652 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        return queryRunner.createTable(
          new Table({
            name: 'PossibleContacts',
            columns: [
              { name: 'id', type: 'int', isPrimary: true, generationStrategy: 'increment', isGenerated: true },
              { name: 'carer', type: 'int'},
              { name: 'familiar', type: 'int'},
              { name: 'contactConfirmated', type: 'boolean'},
              { name: 'relationConfirmated', type: 'boolean'},
            ]
          })
        )
      }

    public async down(queryRunner: QueryRunner): Promise<any> {
        return queryRunner.dropTable('PossibleContacts');
    }

}
