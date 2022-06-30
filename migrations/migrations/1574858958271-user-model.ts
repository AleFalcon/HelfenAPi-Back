import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class UserModel1574858958271 implements MigrationInterface {
  public up(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.createTable(
      new Table({
        name: 'User',
        columns: [
          { name: 'id', type: 'int', isPrimary: true, generationStrategy: 'increment', isGenerated: true },
          { name: 'userType', type: 'int' },
          { name: 'name', type: 'varchar' },
          { name: 'lastName', type: 'varchar' },
          { name: 'dateOfBirth', type: 'Date' },
          { name: 'dniNumber', type: 'varchar', isUnique: true },
          { name: 'localAddress', type: 'varchar' },
          { name: 'mail', type: 'varchar', isUnique: true },
          { name: 'phoneNumber', type: 'varchar', isUnique: true },
          { name: 'password', type: 'varchar' },
          { name: 'diaryId', type: 'int'}
        ]
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.dropTable('User');
  }
}
