import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Diary } from './diary';

@Entity({ name: 'Event' })
export class Event {
  @PrimaryGeneratedColumn()
  @ManyToOne(() => Diary, diary => diary.userIdCarer)
  id: number;

  @Column({
    type: "int",
    nullable: false})
    diaryId: number;

  @Column({
    type: "int",
    nullable: false})
    userIdCarer: number;

  @Column({
    type: "int",
    nullable: false})
    userIdCare: number;

  /*
   * Los días van del 1 al 7, siendo 1 para el Domingo y 7 para el Sabado 
   */
  @Column({
    type: "int",
    nullable: false})
    day: number;

  @Column({
    type: "varchar",
    nullable: false})
    startTime: string;

  @Column({
    type: "varchar",
    nullable: false})
    endTime: string;

  @Column({
    type: Date,
    nullable: false})
    expirationDate: string;

  @Column({
    type: "varchar"
    })
    notes: string;

  constructor(diaryId: number, userIdCarer: number, userIdCare: number, day: number, startTime: string, endTime: string, expirationDate: string, notes: string) {
    this.diaryId = diaryId;
    this.userIdCarer = userIdCarer;
    this.userIdCare = userIdCare;
    this.day = day;
    this.startTime = startTime;
    this.endTime = endTime;
    this.expirationDate = expirationDate;
    this.notes = notes;
  }

}
