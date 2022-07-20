import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Diary } from './diary';
import { Users } from './user';

@Entity({ name: 'Carers' })
export class Carers {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "int",
    nullable: true})
  reviewId?: number;

  @OneToOne(() => Diary)
  @JoinColumn()
  diaryId?: number;

  @Column({
    type: "int",
    nullable: false})
  amountCare: number;

  @Column({
    type: "int",
    nullable: false})
  price: number;

  @Column({
    type: "varchar",
    nullable: false})
  specialty?: string;

  @Column({
    type: "varchar",
    nullable: false})
  experience?: string;

  @OneToOne(() => Users)
  @JoinColumn( {name: "userId"})
  userId: number;

  public modifyData({diaryId, reviewId, amountCare, price, specialty, experience, userId}: any) : void{
    this.reviewId = reviewId === undefined ? this.reviewId : reviewId;
    this.diaryId = diaryId === undefined ? this.diaryId : diaryId;
    this.amountCare = amountCare === undefined ? this.amountCare : amountCare;
    this.price = price === undefined ? this.price : price;
    this.specialty = specialty === undefined ? this.specialty : specialty;
    this.experience = experience === undefined ? this.experience : experience;
    this.userId = userId;
  }

  constructor(amountCare: number = 0, price: number, userId: number, reviewId?: number, diaryId?: number , experience?: string, specialty?: string, ) {
    this.userId = userId;
    this.reviewId = reviewId;
    this.diaryId = diaryId;
    this.amountCare = amountCare;
    this.price = price;
    this.specialty = specialty;
    this.experience = experience;
 }
}
