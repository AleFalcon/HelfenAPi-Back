import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Carers } from './carerUser';

@Entity({ name: 'Events' })
export class Events {
  @PrimaryGeneratedColumn()
  id: number;

  /*
   * Los días van del 1 al 7, siendo 1 para el Domingo y 7 para el Sabado 
   */
  @Column({
    type: "int",
    nullable: false})
    day: number;

  @Column({
    type: "varchar",
    nullable: true})
    notes?: string;

  @Column({
    type: "varchar",
    nullable: false})
    date: string;

  @Column({
    type: "varchar",
    nullable: false})
    startEvent: string;

  @Column({
    type: "varchar",
    nullable: false})
    endEvent: string;

  @Column({
    type: "varchar",
    nullable: false})
    localAddress: string;

  //If this field is null, don't exist expiration date
  @Column({
    type: Date,
    nullable: true})
    expirationDate?: string;

  @ManyToOne(type => Carers, (carer: Carers) => carer.id)
  @JoinColumn({name: "carer", referencedColumnName: "id"})
  carer: Carers
  //   diary: Diaries;

  constructor(carer: Carers, day: number, date: string, startEvent: string, endEvent: string, localAddress: string, expirationDate: string, notes: string) {
    this.carer = carer;
    this.day = day;
    this.notes = notes;
    this.date = date;
    this.startEvent = startEvent;
    this.endEvent = endEvent;
    this.localAddress = localAddress;
    this.expirationDate = expirationDate;
  }

  convertToJson(): any{
    return { date: this.date, day: this.day, endEvent: this.endEvent,
      expirationDate: this.expirationDate, localAddress: this.localAddress, notes: this.notes, startEvent: this.startEvent }
  }

  static builder(user: Carers, {event: eventSaved, id, day, date, startEvent, endEvent, localAddress, expirationDate, notes}: any ): Events {
    const event: Events = new Events( user,
      day === undefined ? eventSaved.day : day,
      date === undefined ? eventSaved.date : date,
      startEvent === undefined ? eventSaved.startEvent : startEvent,
      endEvent === undefined ? eventSaved.endEvent : endEvent,
      localAddress === undefined ? eventSaved.localAddress : localAddress,
      expirationDate === undefined ? eventSaved.expirationDate : expirationDate,
      notes === undefined ? eventSaved.notes : notes);
    event.id = id;
    return event;
    }

    static convertToJson({date, day, endEvent, expirationDate, localAddress, notes, startEvent}: any): any{
      return { date: date, day: day, endEvent: endEvent,expirationDate: expirationDate, localAddress: localAddress, notes: notes, startEvent: startEvent }
    }
}
