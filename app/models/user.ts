import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Users' })
export class Users {
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
    nullable: false})
  localAddress: string;

  @Column({
    type: "varchar",
    unique: true,
    nullable: false})
  mail: string;

  @Column({
    type: "varchar",
    nullable: true})
  otherMail?: string;

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
    type: "varchar",
    nullable: false})
  postalCode: string;

  @Column({
    type: "varchar",
    nullable: false})
  province: string;

  @Column({
    type: "varchar",
    nullable: true})
  latitude: string;

  @Column({
    type: "varchar",
    nullable: true})
  longitude: string;

  @Column({
    type: "varchar",
    nullable: true})
  apartment?: string;

  @Column({
    type: "varchar",
    nullable: true})
  floor?: string;

  @Column({
    type: "char",
    nullable: true})
  gender: string;
  
  userType: number

  constructor(name: string, lastName: string, dateOfBirth: string, dniNumber: string, localAddress: string,
    mail: string, phoneNumber: string, password: string, postalCode: string, province: string, gender: string, 
    latitude: string, longitude: string, otherMail?: string, apartment?: string, floor?: string) {
      this.name = name;
      this.lastName = lastName;
      this.dateOfBirth = dateOfBirth;
      this.dniNumber = dniNumber;
      this.localAddress = localAddress;
      this.mail = mail;
      this.otherMail = otherMail;
      this.phoneNumber = phoneNumber;
      this.password = password;
      this.postalCode = postalCode;
      this.province = province;
      this.gender = gender;
      this.apartment  = apartment;
      this.floor = floor;
      this.latitude = latitude;
      this.longitude = longitude;

    }

  static builder({id, name, lastName, dateOfBirth, dniNumber, localAddress, mail, phoneNumber, password,
    postalCode, province, gender, latitude, longitude, otherMail, apartment, floor}: any ): Users {
    const user: Users = new Users(name, lastName, dateOfBirth, dniNumber, localAddress, mail, phoneNumber, password,
        postalCode, province, gender, latitude, longitude, otherMail, apartment, floor )
    user.id = id;
    return user;
    }

  modifyData({ name, lastName, dateOfBirth, localAddress, otherMail, phoneNumber, postalCode, province, apartment, gender, latitude, longitude, floor }: any): void{
      this.name = name === undefined ? this.name : name;
      this.lastName = lastName === undefined ? this.lastName : lastName;
      this.dateOfBirth = dateOfBirth === undefined ? this.dateOfBirth : dateOfBirth;
      this.localAddress = localAddress === undefined ? this.localAddress : localAddress;
      this.otherMail = otherMail === undefined ? this.otherMail : otherMail;
      this.phoneNumber = phoneNumber === undefined ? this.phoneNumber : phoneNumber;
      this.postalCode = postalCode === undefined ? this.postalCode : postalCode;
      this.province = province === undefined ? this.province : province;
      this.apartment  = apartment === undefined ? this.apartment : apartment;
      this.latitude = latitude === undefined ? this.latitude : latitude;
      this.longitude = longitude === undefined ? this.longitude : longitude;
      this.gender  = gender === undefined ? this.gender : gender;
      this.floor = floor === undefined ? this.floor : floor;
  }

  static convertToJson({name, lastName, dateOfBirth, localAddress, mail, otherMail, phoneNumber, postalCode, province, apartment, gender, latitude, longitude, floor, id}: Users): any{
    return {name: name, lastName: lastName, dateOfBirth: dateOfBirth, localAddress: localAddress, mail: mail, otherMail: otherMail, 
      phoneNumber: phoneNumber, postalCode: postalCode, province: province, apartment: apartment, gender: gender, latitude: latitude,
      longitude: longitude, floor: floor, id: id}
   }

   public getLongitude(): string {
      return this.longitude
    }
  
   public getLatitude(): string {
      return this.latitude
   }
}
