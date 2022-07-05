import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'CarerUsers' })
export class CarerUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "varchar",
    nullable: false})
  name: string;

  @Column({
    type: "varchar",
    nullable: false})
  lastName: string;

  @Column({
    type: Date,
    nullable: false})
  dateOfBirth: string;

  @Column({
    type: "varchar",
    unique: true,
    nullable: false})
  dniNumber: string;

  @Column({
    type: "varchar",
    unique: true,
    nullable: false})
  mail: string;

  @Column({
    type: "varchar",
    unique: true,
    nullable: false})
  phoneNumber: string;

  @Column({
    type: "varchar",
    nullable: false})
  password: string;

  @Column({
    type: "int",
    nullable: true})
    reviews: number;

  @Column({
    type: "int",
    nullable: true})
    carer: number;

  @Column({
    type: "int",
    nullable: false})
    diaryId: number;

  @Column({
    type: "int",
    nullable: false})
    amountCate: number;

  @Column({
    type: "int",
    nullable: false})
    price: number;


  constructor(name: string, lastName: string, dateOfBirth: string, dniNumber: string,
     mail: string, phoneNumber: string, password: string, amountCare: number, price: number) {
    this.name = name;
    this.lastName = lastName;
    this.dateOfBirth = dateOfBirth;
    this.dniNumber = dniNumber;
    this.mail = mail;
    this.phoneNumber = phoneNumber;
    this.password = password;
    this.amountCate = amountCare;
    this.price = price;
  }

}
