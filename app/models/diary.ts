import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Carers } from './carerUser';
import { Events } from './event';

@Entity({ name: 'Diaries' })
export class Diaries {

  @PrimaryGeneratedColumn()
    id: number;
  
   @Column({
     type: "int",
     nullable: false})
  //userId: number;
  carerUser: Carers

  @OneToMany(() => Events, (event) => event.id)
  events: Events[];

  constructor(carerUser: Carers, events: Events[]) {
    //this.userId = userId;
    this.carerUser = carerUser;
    this.events = events;
  }

}
