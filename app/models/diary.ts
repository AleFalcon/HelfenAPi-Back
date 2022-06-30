import { Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Event } from './event';

@Entity({ name: 'Diary' })
export class Diary {

  @PrimaryColumn({
    type: "int",
    unique: true,
    nullable: false})
    userIdCarer: number;
  
  @OneToMany(() => Event, event => event.id)
  events: Event[];

  constructor(userIdCarer: number, events: Event[]) {
    this.userIdCarer = userIdCarer;
    this.events = events;
  }

}
