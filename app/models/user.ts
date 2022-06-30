import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Diary } from './diary';

@Entity({ name: 'User' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  /* 
  * 1 corresponde al roll de usuario
  * 2 corresponde al roll de cuidador
  * 3 corresponde al roll de administrador
  */
  @Column({
    type: "int",
    nullable: false})
  userType: number;

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
    nullable: false})
  localAddress: string;

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

  @OneToOne(() => Diary) @JoinColumn()
  diaryId: number;

  constructor(type: number, name: string, lastName: string, dateOfBirth: string, dniNumber: string, localAddress: string, mail: string, phoneNumber: string, password: string) {
    this.userType = type;
    this.name = name;
    this.lastName = lastName;
    this.dateOfBirth = dateOfBirth;
    this.dniNumber = dniNumber;
    this.localAddress = localAddress;
    this.mail = mail;
    this.phoneNumber = phoneNumber;
    this.password = password;
  }

}
