import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Carers } from "./carerUser";

@Entity({ name: 'Services' })
export class Services {

  @PrimaryColumn()
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
      return { carer: this.carer.id, description: this.description }
    }

    static convertToJson({carer, description}: any): any{
      return { carer: carer.id, description: description }
    }
  }
