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
  @JoinColumn({name: "userId"})
  userId: number;

  modifyData({reviews, carer, userId}: any): void{
    this.reviews = reviews === undefined ? this.reviews : reviews;
    this.carer = carer === undefined ? this.carer : carer;
    this.userId = userId;
  }
  
  constructor(userId: number, reviews?: number, carer?: number) {
    this.reviews = reviews;
    this.carer = carer;
    this.userId = userId;
  }

}
