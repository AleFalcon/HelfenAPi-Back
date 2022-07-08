import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class ForeignkeyUser1657135614304 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createForeignKey(
            "Familiars", new TableForeignKey({
                columnNames: ["userId"],
                referencedColumnNames: ["id"],
                referencedTableName: "Users",
                onDelete: "CASCADE",
            })
          )

          await queryRunner.createForeignKey(
            "Carers", new TableForeignKey({
                columnNames: ["userId"],
                referencedColumnNames: ["id"],
                referencedTableName: "Users",
                onDelete: "CASCADE",
            })
          )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        let table: Table|undefined = await queryRunner.getTable("User");
        if(table !== undefined) {
        const foreignKey: TableForeignKey | undefined = table.foreignKeys.find(
            (fk) => fk.columnNames.includes("userId"),
          )
            if(foreignKey !== undefined) {
            await queryRunner.dropForeignKey("User", foreignKey)
           }
        }
        table = await queryRunner.getTable("User");
        if(table !== undefined) {
          const foreignKey: TableForeignKey | undefined = table.foreignKeys.find(
            (fk) => fk.columnNames.includes("userId"),
        )
          if(foreignKey !== undefined) {
            await queryRunner.dropForeignKey("User", foreignKey)
          }
        }
    }

}
