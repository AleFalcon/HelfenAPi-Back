import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class foreignkeyUserDiaryEvent1657582377036 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createForeignKey(
            "Carers", new TableForeignKey({
                columnNames: ["diaryId"],
                referencedColumnNames: ["id"],
                referencedTableName: "Diaries",
                onDelete: "CASCADE",
            })
          )

        await queryRunner.createForeignKey(
        "Diaries", new TableForeignKey({
            columnNames: ["eventId"],
            referencedColumnNames: ["id"],
            referencedTableName: "Events",
            onDelete: "CASCADE",
        })
        )

          
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        let table: Table|undefined = await queryRunner.getTable("Carers");
        if(table !== undefined) {
        const foreignKey: TableForeignKey | undefined = table.foreignKeys.find(
            (fk) => fk.columnNames.includes("diaryId"),
          )
            if(foreignKey !== undefined) {
            await queryRunner.dropForeignKey("Carers", foreignKey)
           }
        }
        table = await queryRunner.getTable("Diaries");
        if(table !== undefined) {
          const foreignKey: TableForeignKey | undefined = table.foreignKeys.find(
            (fk) => fk.columnNames.includes("events"),
        )
          if(foreignKey !== undefined) {
            await queryRunner.dropForeignKey("Diaries", foreignKey)
          }
        }
    }

}
