import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class familiarUsers1657042355074 implements MigrationInterface {

    public up(queryRunner: QueryRunner): Promise<void> {
        return queryRunner.createTable(
          new Table({
            name: 'FamiliarUsers',
            columns: [
              { name: 'familiarUserId', type: 'int', isPrimary: true, generationStrategy: 'increment', isGenerated: true },
              { name: 'familiarUserName', type: 'varchar' },
              { name: 'familiarUserLastName', type: 'varchar' },
              { name: 'familiarUserDateOfBirth', type: 'Date' },
              { name: 'familiarUserDniNumber', type: 'varchar', isUnique: true },
              { name: 'familiarUserLocalAddress', type: 'varchar' },
              { name: 'familiarUserMail', type: 'varchar', isUnique: true },
              { name: 'familiarUserPhoneNumber', type: 'varchar', isUnique: true },
              { name: 'familiarUserPassword', type: 'varchar' },
              { name: 'familiarUserReviews', type: 'int'},
              { name: 'familiarUserCarer', type: 'int'}
            ]
          })
        );
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        return queryRunner.dropTable('FamiliarUsers');
      }
}
