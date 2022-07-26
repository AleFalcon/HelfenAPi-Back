import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class User1657134874908 implements MigrationInterface {

    public up(queryRunner: QueryRunner): Promise<void> {
        return queryRunner.createTable(
          new Table({
            name: 'Users',
            columns: [
              { name: 'id', type: 'int', isPrimary: true, generationStrategy: 'increment', isGenerated: true },
              { name: 'name', type: 'varchar' },
              { name: 'lastName', type: 'varchar' },
              { name: 'dateOfBirth', type: 'Date' },
              { name: 'dniNumber', type: 'varchar', isUnique: true },
              { name: 'localAddress', type: 'varchar' },
              { name: 'mail', type: 'varchar', isUnique: true },
              { name: 'otherMail', type: 'varchar', isNullable: true },
              { name: 'phoneNumber', type: 'varchar', isUnique: true },
              { name: 'password', type: 'varchar' },
              { name: 'postalCode', type: 'varchar'},
              { name: 'province', type: 'varchar'},
              { name: 'apartment', type: 'varchar', isNullable: true},
              { name: 'gender', type: 'char'},
              { name: 'floor', type: 'varchar', isNullable: true}
            ]
          })
        );
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        return queryRunner.dropTable('Users');
      }

}
