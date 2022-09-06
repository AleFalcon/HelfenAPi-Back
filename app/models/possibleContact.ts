import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Carers } from "./carerUser";
import { Familiars } from "./familiarUser";

@Entity({ name: 'PossibleContacts' })
export class PossibleContacts {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Carers, (carer: Carers) => carer.id, {eager: true})
  @JoinColumn({name: "carer", referencedColumnName: "id"})
  carer?: Carers;
 
  @ManyToOne(() => Familiars, (familiar: Familiars) => familiar.id, {eager: true})
  @JoinColumn({name: "familiar", referencedColumnName: "id"})
  familiar: Familiars;

  @Column({
    type: 'int',
    nullable: false})
    contactConfirmated: number;

  @Column({
    type: 'int',
    nullable: false})
  relationConfirmated: number;

  constructor(carer: Carers, familiar: Familiars, contactConfirmated: Boolean, relationConfirmated: Boolean){
    this.carer = carer;
    this.familiar = familiar
    this.contactConfirmated = this.convertBoolean(contactConfirmated)
    this.relationConfirmated = this.convertBoolean(relationConfirmated) // o = ture ; 1 = false
  }

  setCarer(carer?: Carers){
    this.carer = carer
  }

    convertToJson(): any{
      return { id: this.id, carer: this.carer, familiar: this.familiar, contactConfirmated: this.convertAvailable(this.contactConfirmated),
        relationConfirmated: this.convertAvailable(this.relationConfirmated)}
    }

    static convertToJson({carer, familiar}: any): any{
      return { carer: carer.id, familiar: familiar.id }
    }

    convertBoolean(value: Boolean): number {
      return value ? 0 : 1
    }

    convertAvailable(value: number): Boolean {
      return value == 0 ? true : false
    }
  }
