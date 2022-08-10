import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Carers } from "./carerUser";

@Entity({ name: 'Services' })
export class Services {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "varchar",
    nullable: false})
    description : string;

  @Column({
    type: "int",
    nullable: false})
    carer: Carers;

    constructor(carer: Carers, description: string){
        this.carer = carer;
        this.description = description
    }

    convertToJson(): any{
      return { id: this.id, carer: this.carer.id, description: this.description }
    }

    static convertToJson({id, carer, description}: any): any{
      return { id: id, carer: carer.id, description: description }
    }
  }
