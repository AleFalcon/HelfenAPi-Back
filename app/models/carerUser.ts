import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Diaries } from './diary';
import { Events } from './event';
import { Users } from './user';

@Entity({ name: 'Carers' })
export class Carers {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "int",
    nullable: true})
  reviewId?: number;

  @OneToMany(() => Events, event => event.id)
  events: Events[]
  
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

  @Column({name: "userId", type: "int", nullable: true})
  @OneToOne(() => Users)
  @JoinColumn({})
  user: Users;

  public modifyData({diary, reviewId, amountCare, price, specialty, experience, user}: any): void{
    this.reviewId = reviewId === undefined ? this.reviewId : reviewId;
    this.amountCare = amountCare === undefined ? this.amountCare : amountCare;
    this.price = price === undefined ? this.price : price;
    this.specialty = specialty === undefined ? this.specialty : specialty;
    this.experience = experience === undefined ? this.experience : experience;
    this.user = user;
  }

  constructor(amountCare: number, price: number, user: Users, reviewId?: number, diary?: Diaries , experience?: string, specialty?: string ) {
    this.user = user;
    this.reviewId = reviewId;
    this.amountCare = amountCare;
    this.price = price;
    this.specialty = specialty;
    this.experience = experience;
 }
}
