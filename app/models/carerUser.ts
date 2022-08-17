import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Reviews } from './review';
import { Services } from './service';
import { Users } from './user';

@Entity({ name: 'Carers' })
export class Carers {
  @PrimaryGeneratedColumn()
  id: number;
  
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

  @OneToOne(() => Users, (user: Users) => user.id, {eager: true})
  @JoinColumn( { name: "userId", referencedColumnName: "id" })
  user: Users;

  @OneToMany(() => Reviews, review => review.id)
  reviews: Reviews[]

  @OneToMany(() => Services, service => service.carer)
  services: Services[]

  public modifyData({amountCare, price, specialty, experience, user}: any): void{
    this.amountCare = amountCare === undefined ? this.amountCare : amountCare;
    this.price = price === undefined ? this.price : price;
    this.specialty = specialty === undefined ? this.specialty : specialty;
    this.experience = experience === undefined ? this.experience : experience;
    this.user = user;
  }

  constructor(amountCare: number, price: number, user: Users, experience?: string, specialty?: string ) {
    this.user = user;
    this.amountCare = amountCare;
    this.price = price;
    this.specialty = specialty;
    this.experience = experience;
 }

 public setUser(user: Users): void {
  this.user = user;
 }
}
