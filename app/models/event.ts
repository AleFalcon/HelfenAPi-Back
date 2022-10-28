import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Carers } from './carerUser';

@Entity({ name: 'Events' })
export class Events {
  @PrimaryGeneratedColumn()
  id: number;

  /*
   * Los días van del 0 al 6, siendo 0 para el Domingo y 6 para el Sabado 
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
    
  @Column({
    type: 'int',
    nullable: false})
    status: number;

  @Column({
    type: 'int',
    nullable: false})
    familiar: number;

  days: number[] = []
  stringDays: string[] = []

  @ManyToOne(() => Carers, (carer: Carers) => carer.id, {eager: true})
  @JoinColumn({name: "carer", referencedColumnName: "id"})
  carer: Carers

  constructor(carer: Carers, day: number, date: string, startEvent: string, endEvent: string, localAddress: string, expirationDate: string, notes: string, status: boolean, familiar: number) {
    this.carer = carer;
    this.day = day;
    this.notes = notes;
    this.date = date;
    this.startEvent = startEvent;
    this.endEvent = endEvent;
    this.localAddress = localAddress;
    this.expirationDate = expirationDate;
    this.status = this.convertBoolean(status);
    this.familiar = familiar;
  }

  convertToJson(): any{
    return { id: this.id, carer: this.carer, date: this.date, day: this.day, endEvent: this.endEvent,
      expirationDate: this.expirationDate, localAddress: this.localAddress, notes: this.notes, startEvent: this.startEvent, status: Events.convertAvailable(this.status) }
  }

  static builder(user: Carers, {event: eventSaved, id, day, date, startEvent, endEvent, localAddress, expirationDate, notes, status, familiar}: any ): Events {
    const event: Events = new Events( user,
      day === undefined ? eventSaved.day : day,
      date === undefined ? eventSaved.date : date,
      startEvent === undefined ? eventSaved.startEvent : startEvent,
      endEvent === undefined ? eventSaved.endEvent : endEvent,
      localAddress === undefined ? eventSaved.localAddress : localAddress,
      expirationDate === undefined ? eventSaved.expirationDate : expirationDate,
      notes === undefined ? eventSaved.notes : notes,
      status === undefined ? Events.convertAvailable(eventSaved.status) : Events.convertAvailable(status),
      familiar === undefined ? eventSaved.familiar : familiar);
    event.id = id;
    return event;
    }

    static convertToJson({id, carer, date, day, endEvent, expirationDate, localAddress, notes, startEvent, status, familiar}: any): any{
      return { id: id, carer: carer, date: date, day: day, endEvent: endEvent,expirationDate: expirationDate, localAddress: localAddress, notes: notes, startEvent: startEvent, status: this.convertAvailable(status), familiar: familiar }
    }

    setStatus(value: Boolean): void {
      this.status = value ? 0 : 1
    }

    convertBoolean(value: Boolean): number {
      return value ? 0 : 1
    }

    static convertAvailable(value: number): boolean {
      return value == 0 ? true : false
    }
}
