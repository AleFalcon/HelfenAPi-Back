import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Diary } from './diary';

@Entity({ name: 'Event' })
export class Event {
  @PrimaryGeneratedColumn()
  @ManyToOne(() => Diary, diary => diary.userIdCarer)
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
    notes: string;

  @Column({
    type: "varchar",
    nullable: false})
    startTime: string;

  @Column({
    type: "varchar",
    nullable: false})
    endTime: string;

  @Column({
    type: "varchar",
    nullable: false})
    localAddress: string;

  @Column({
    type: Date,
    nullable: false})
    expirationDate: string;

  constructor(day: number, notes: string, startTime: string, endTime: string, localAddress: string, expirationDate: string) {
    this.day = day;
    this.notes = notes;
    this.startTime = startTime;
    this.endTime = endTime;
    this.localAddress = localAddress;
    this.expirationDate = expirationDate;
  }

}
