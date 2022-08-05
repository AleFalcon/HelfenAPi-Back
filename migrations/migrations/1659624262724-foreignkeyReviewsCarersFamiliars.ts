import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class ForeignkeyReviewsCarersFamiliars1659624262724 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createForeignKey(
            "Reviews", new TableForeignKey({
                columnNames: ["carer"],
                referencedColumnNames: ["id"],
                referencedTableName: "Carers",
                onDelete: "CASCADE",
            })
          )
        await queryRunner.createForeignKey(
            "Reviews", new TableForeignKey({
                columnNames: ["familiar"],
                referencedColumnNames: ["id"],
                referencedTableName: "Familiars",
                onDelete: "CASCADE",
        })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        let table: Table|undefined = await queryRunner.getTable("Reviews");
        if(table !== undefined) {
        const foreignKey: TableForeignKey | undefined = table.foreignKeys.find(
            (fk) => fk.columnNames.includes("carer"),
          )
            if(foreignKey !== undefined) {
            await queryRunner.dropForeignKey("Reviews", foreignKey)
           }
        }

        table = await queryRunner.getTable("Reviews");
        if(table !== undefined) {
        const foreignKey: TableForeignKey | undefined = table.foreignKeys.find(
            (fk) => fk.columnNames.includes("familiar"),
          )
            if(foreignKey !== undefined) {
            await queryRunner.dropForeignKey("Reviews", foreignKey)
           }
        }
    }
}
