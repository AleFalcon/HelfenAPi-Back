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
  latitudeCurrent?: string;

  @Column({
    type: "varchar",
    nullable: false})
  longitudeCurrent?: string;

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

  public modifyData({amountCare, price, specialty, experience, latitudeCurrent, longitudeCurrent, user}: any): void{
    this.amountCare = amountCare === undefined ? this.amountCare : amountCare;
    this.price = price === undefined ? this.price : price;
    this.specialty = specialty === undefined ? this.specialty : specialty;
    this.experience = experience === undefined ? this.experience : experience;
    this.latitudeCurrent = latitudeCurrent === undefined ? this.latitudeCurrent : latitudeCurrent;
    this.longitudeCurrent = longitudeCurrent === undefined ? this.longitudeCurrent : longitudeCurrent;
    this.user = user;
  }

  constructor(amountCare: number, price: number, user: Users, latitudeCurrent?: string, longitudeCurrent?: string, experience?: string, specialty?: string ) {
    this.user = user;
    this.amountCare = amountCare;
    this.price = price;
    this.specialty = specialty;
    this.experience = experience;
    this.latitudeCurrent = latitudeCurrent;
    this.longitudeCurrent = longitudeCurrent;
 }

 static convertToJson({user, amountCare, price, specialty, experience, latitudeCurrent, longitudeCurrent}: Carers): any{
  return {user: Users.convertToJson(user), amountCare: amountCare, price: price, latitudeCurrent: latitudeCurrent, longitudeCurrent: longitudeCurrent, specialty: specialty, experience: experience}
 }

 public setUser(user: Users): void {
  this.user = user;
 }

 public setLongitudeCurrent(longitudeCurrent: string): void {
  this.longitudeCurrent = longitudeCurrent;
 }

 public setLatitudeCurrent(latitudeCurrent: string): void {
  this.latitudeCurrent = latitudeCurrent;
 }

}
