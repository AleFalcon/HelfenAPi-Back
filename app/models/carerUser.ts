import { invalidSpeciality } from '../errors/constantsErrors';
import { HandlerError } from '../errors/handlerError';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PossibleContacts } from './possibleContact';
import { Reviews } from './review';
import { Services } from './service';
import { Users } from './user';
import HttpStatus from 'http-status-codes';

const specialityString = new Map<string, number>([
  ["Cuidador", 1],
  ["Acompaniante", 2],
  ["Ambas", 3]
]);

const specialityNumber = new Map<number, string>([
  [1, "Cuidador"],
  [2, "Acompaniante"],
  [3, "Ambas"]
]);

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
    type: "int",
    nullable: false})
  specialty: number;

  @Column({
    type: "int",
    nullable: false})
  isNurse: number;

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

  distance: number

  public modifyData({amountCare, price, specialty, experience, latitudeCurrent, longitudeCurrent, user, isNurse}: any): void{
    this.amountCare = amountCare === undefined ? this.amountCare : amountCare;
    this.price = price === undefined ? this.price : price;
    this.specialty = specialty === undefined ? this.specialty : this.definedSpeciality(specialty);
    this.experience = experience === undefined ? this.experience : experience;
    this.latitudeCurrent = latitudeCurrent === undefined ? this.latitudeCurrent : latitudeCurrent;
    this.longitudeCurrent = longitudeCurrent === undefined ? this.longitudeCurrent : longitudeCurrent;
    this.isNurse = isNurse === undefined ? this.isNurse : this.convertBoolean(isNurse);
    this.user = user;
  }

  constructor(amountCare: number, price: number, user: Users, specialty: string, isNurse: boolean, latitudeCurrent?: string, longitudeCurrent?: string, experience?: string) {
    this.user = user;
    this.amountCare = amountCare;
    this.price = price;
    this.specialty = this.definedSpeciality(specialty);
    this.isNurse = this.convertBoolean(isNurse)
    this.experience = experience;
    this.latitudeCurrent = latitudeCurrent;
    this.longitudeCurrent = longitudeCurrent;
 }

 static convertToJson({user, amountCare, price, specialty, isNurse, experience, latitudeCurrent, longitudeCurrent, id}: Carers): any{
  return {user: Users.convertToJson(user), amountCare: amountCare, price: price, latitudeCurrent: latitudeCurrent, 
    longitudeCurrent: longitudeCurrent, specialty: this.convertSpeciality(specialty), isNurse: this.convertAvailable(isNurse),
    experience: experience, carerId: id}
 }

 convertToJson(): any{
  return {user: Users.convertToJson(this.user), amountCare: this.amountCare, price: this.price, latitudeCurrent: this.latitudeCurrent, 
    longitudeCurrent: this.longitudeCurrent, specialty: this.convertSpeciality(), isNurse: this.convertAvailable(this.isNurse),
    experience: this.experience, carerId: this.id}
 }

  static convertSpeciality(specialty: number) {
    const speciality = specialityNumber.get(specialty)
    if (speciality === undefined) {
      throw new HandlerError(invalidSpeciality, HttpStatus.BAD_REQUEST)
    }
  return speciality
  }
  static convertAvailable(isNurse: number) {
    return isNurse == 0 ? true : false
  }

 public definedSpeciality(specialty: string): number{
  const specialityNumber = specialityString.get(specialty)
  if (specialityNumber === undefined) {
    return 4
  }
  return specialityNumber
 } 

 public setUser(user: Users): void {
  this.user = user;
 }

 public setDistance(distance: number): void {
  this.distance = distance;
 }

 public setLongitudeCurrent(longitudeCurrent: string): void {
  this.longitudeCurrent = longitudeCurrent;
 }

 public setLatitudeCurrent(latitudeCurrent: string): void {
  this.latitudeCurrent = latitudeCurrent;
 }

 public getLongitudeCurrent(): string {
  if(this.longitudeCurrent === undefined){
    return ""
  } else {
    return this.longitudeCurrent
  }
}

 public getLatitudeCurrent(): string {
  if (this.latitudeCurrent === undefined){
    return ""
  } else {
    return this.latitudeCurrent
  }
 }

 public convertBoolean(value: Boolean): number {
  return value ? 0 : 1
 }

 public convertAvailable(value: number): Boolean {
  return value == 0 ? true : false
 }

 public convertSpeciality(): string {
  const speciality = specialityNumber.get(this.specialty)
  if (speciality === undefined) {
    throw new HandlerError(invalidSpeciality, HttpStatus.BAD_REQUEST)
  }
  return speciality
 }
}
