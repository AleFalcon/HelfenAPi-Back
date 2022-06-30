import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class ForeignkeyUserDiaryEvent1654013565838 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createForeignKey(
            "User", new TableForeignKey({
                columnNames: ["diaryId"],
                referencedColumnNames: ["userIdCarer"],
                referencedTableName: "Diary",
                onDelete: "CASCADE",
            })
          )

        await queryRunner.createForeignKey(
        "Diary", new TableForeignKey({
            columnNames: ["events"],
            referencedColumnNames: ["id"],
            referencedTableName: "Event",
            onDelete: "CASCADE",
        })
        )

          
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        let table: Table|undefined = await queryRunner.getTable("User");
        if(table !== undefined) {
        const foreignKey: TableForeignKey | undefined = table.foreignKeys.find(
            (fk) => fk.columnNames.includes("diaryId"),
          )
            if(foreignKey !== undefined) {
            await queryRunner.dropForeignKey("User", foreignKey)
           }
        }
        table = await queryRunner.getTable("Diary");
        if(table !== undefined) {
          const foreignKey: TableForeignKey | undefined = table.foreignKeys.find(
            (fk) => fk.columnNames.includes("events"),
        )
          if(foreignKey !== undefined) {
            await queryRunner.dropForeignKey("Diary", foreignKey)
          }
        }
    }

}
