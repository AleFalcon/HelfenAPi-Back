import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Reviews } from './review';
import { Users } from './user';

@Entity({ name: 'Familiars' })
export class Familiars {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "int",
    nullable: true})
    carer?: number;

  @OneToOne(() => Users)
  @JoinColumn( { name: "userId", referencedColumnName: "id" })
  user: Users;

  @OneToMany(() => Reviews, review => review.id)
  reviews: Reviews[]

  modifyData({reviews, carer, user}: any): void{
    this.carer = carer === undefined ? this.carer : carer;
    this.user = user;
  }
  
  constructor(user: Users, reviews?: number, carer?: number) {
    this.carer = carer;
    this.user = user;
  }

}
