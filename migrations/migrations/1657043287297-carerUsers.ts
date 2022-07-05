import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class carerUsers1657043287297 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        return queryRunner.createTable(
          new Table({
            name: 'CarerUser',
            columns: [
              { name: 'carerUserId', type: 'int', isPrimary: true, generationStrategy: 'increment', isGenerated: true },
              { name: 'carerUserName', type: 'varchar' },
              { name: 'carerUserLastName', type: 'varchar' },
              { name: 'carerUserDateOfBirth', type: 'Date' },
              { name: 'carerUserDniNumber', type: 'varchar', isUnique: true },
              { name: 'carerUserMail', type: 'varchar', isUnique: true },
              { name: 'carerUserPhoneNumber', type: 'varchar', isUnique: true },
              { name: 'carerUserPassword', type: 'varchar' },
              { name: 'carerUserDiaryId', type: 'int'},
              { name: 'carerUserReview', type: 'int'},
              { name: 'carerUserAmountCare', type: 'int'},
              { name: 'carerUserPrice', type: 'int'}
            ]
          })
        );
      }

    public async down(queryRunner: QueryRunner): Promise<any> {
        return queryRunner.dropTable('CarerUser');
    }

}
