import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PossibleContacts } from './possibleContact';
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

  services: Services[]

  reviews: Reviews[]

  @OneToMany(() => PossibleContacts, possibleContacts => possibleContacts.carer)
  possibleContacts: PossibleContacts[]

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

 static convertToJson({user, amountCare, price, specialty, experience}: Carers): any{
  return {user: Users.convertToJson(user), amountCare: amountCare, price: price, specialty: specialty, experience: experience}
 }

 public setUser(user: Users): void {
  this.user = user;
 }
}
