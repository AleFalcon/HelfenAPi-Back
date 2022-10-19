import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Carers } from './carerUser';
import { Familiars } from './familiarUser';

@Entity({ name: 'Reviews' })
export class Reviews {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Carers, (carer: Carers) => carer.id, {eager: true})
  @JoinColumn({name: "carer", referencedColumnName: "id"})
    carer: Carers;

  @ManyToOne(() => Familiars, (familiar: Familiars) => familiar.id, {eager: true})
  @JoinColumn({name: "familiar", referencedColumnName: "id"})
    familiar: Familiars;

  @Column({
    type: "varchar",
    nullable: true})
    comment?: string;

  @Column({
    type: "int",
    nullable: false})
    classification: number;
  
  constructor(carer: Carers, familiar: Familiars, classification: number, comment?: string) {
    this.carer = carer;
    this.familiar = familiar;
    this.classification = classification;
    this.comment = comment;
  }

  static convertToJson({id, carer, familiar, comment, classification}: any): any{
    return { id: id, carer: carer.id, familiar: familiar.id, comment: comment, classification: classification }
  }

  convertToJson(): any{
    return { id: this.id, carer: this.carer.id, familiar: this.familiar.id,
      comment: this.comment, classification: this.classification }
  }

  static builder(reviewSaved: Reviews, {id, comment, classification}: any ): Reviews {
    const review: Reviews = new Reviews(
      reviewSaved.carer,
      reviewSaved.familiar,
      classification === undefined ? reviewSaved.classification : classification,
      comment === undefined ? reviewSaved.comment : comment);
    review.id = id;
    return review;
    }

  static calculateQualification(reviews: Reviews[]): number {
    let qualification: number = 0;
    let count: number = 0;
    reviews.forEach((review: Reviews) => {
      qualification += review.classification
      count ++
    })
    return qualification/count
    }
}
