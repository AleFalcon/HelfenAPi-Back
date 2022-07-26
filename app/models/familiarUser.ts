import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Users } from './user';

@Entity({ name: 'Familiars' })
export class Familiars {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "int",
    nullable: true})
    reviews?: number;

  @Column({
    type: "int",
    nullable: true})
    carer?: number;

  @OneToOne(() => Users)
  @JoinColumn( { name: "userId", referencedColumnName: "id" })
  user: Users;

  modifyData({reviews, carer, user}: any): void{
    this.reviews = reviews === undefined ? this.reviews : reviews;
    this.carer = carer === undefined ? this.carer : carer;
    this.user = user;
  }
  
  constructor(user: Users, reviews?: number, carer?: number) {
    this.reviews = reviews;
    this.carer = carer;
    this.user = user;
  }

}
