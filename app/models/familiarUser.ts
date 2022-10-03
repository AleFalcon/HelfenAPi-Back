import { Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PossibleContacts } from './possibleContact';
import { Reviews } from './review';
import { Users } from './user';

@Entity({ name: 'Familiars' })
export class Familiars {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Users, (user: Users) => user.id, {eager: true})
  @JoinColumn( { name: "userId", referencedColumnName: "id" })
  user: Users;

  @OneToMany(() => Reviews, review => review.id)
  reviews: Reviews[]

  @OneToMany(() => PossibleContacts, possibleContacts => possibleContacts.familiar)
  possibleContacts: PossibleContacts[]

  modifyData({user}: any): void{
    this.user = user;
  }
  
  constructor(user: Users) {
    this.user = user;
  }

  static convertToJson({user}: Familiars): any{
    return {user: Users.convertToJson(user)}
   }

   convertToJson(): any{
    return {user: Users.convertToJson(this.user), familiarId: this.id}
   }
}
