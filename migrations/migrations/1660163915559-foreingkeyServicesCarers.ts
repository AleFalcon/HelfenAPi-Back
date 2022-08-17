import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class foreingkeyServicesCarers1660163915559 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createForeignKey(
            "Services", new TableForeignKey({
                columnNames: ["carer"],
                referencedColumnNames: ["id"],
                referencedTableName: "Carers",
                onDelete: "CASCADE",
            })
          )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table: Table|undefined = await queryRunner.getTable("Carers");
        if(table !== undefined) {
        const foreignKey: TableForeignKey | undefined = table.foreignKeys.find(
            (fk) => fk.columnNames.includes("carer"),
          )
            if(foreignKey !== undefined) {
            await queryRunner.dropForeignKey("Carers", foreignKey)
           }
        }
    }

}
