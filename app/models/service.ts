import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, /*PrimaryGeneratedColumn*/ } from "typeorm";
import { Carers } from "./carerUser";

@Entity({ name: 'Services' })
export class Services {
  // @PrimaryGeneratedColumn()
  // id: number;

  @PrimaryColumn()
  // @Column({
  //   type: "varchar",
  //   nullable: false})
    description : string;

  @PrimaryColumn()
  @ManyToOne(() => Carers, (carer: Carers) => carer.id, {eager: true})
  @JoinColumn({name: "carer", referencedColumnName: "id"})
  carer: Carers;

    constructor(carer: Carers, description: string){
        this.carer = carer;
        this.description = description
    }

    convertToJson(): any{
//      return { id: this.id, carer: this.carer.id, description: this.description }
      return { carer: this.carer.id, description: this.description }
    }

    static convertToJson({carer, description}: any): any{
//    static convertToJson({id, carer, description}: any): any{
  //    return { id: id, carer: carer.id, description: description }
      return { carer: carer.id, description: description }
    }
  }
