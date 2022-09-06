import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class foreingkeyPossibleContactsUsers1661982920114 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
          await queryRunner.createForeignKey(
            "PossibleContacts", new TableForeignKey({
                columnNames: ["carer"],
                referencedColumnNames: ["id"],
                referencedTableName: "Carers",
                onDelete: "CASCADE",
            }))

          await queryRunner.createForeignKey(
            "PossibleContacts", new TableForeignKey({
                columnNames: ["familiar"],
                referencedColumnNames: ["id"],
                referencedTableName: "Familiars",
                onDelete: "CASCADE",
            }))
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        let table: Table|undefined = await queryRunner.getTable("PossibleContacts");
        if(table !== undefined) {
        const foreignKey: TableForeignKey | undefined = table.foreignKeys.find(
            (fk) => fk.columnNames.includes("carer"),
          )
            if(foreignKey !== undefined) {
            await queryRunner.dropForeignKey("PossibleContacts", foreignKey)
           }
        }
        table = await queryRunner.getTable("PossibleContacts");
        if(table !== undefined) {
        const foreignKey: TableForeignKey | undefined = table.foreignKeys.find(
            (fk) => fk.columnNames.includes("familiar"),
          )
            if(foreignKey !== undefined) {
            await queryRunner.dropForeignKey("PossibleContacts", foreignKey)
           }
        }
    }

}
