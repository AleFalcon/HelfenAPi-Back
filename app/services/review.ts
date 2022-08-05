import { HandlerError } from '../errors/handlerError';
import { DeleteResult, FindConditions, getRepository, Repository } from 'typeorm';
import HttpStatus from 'http-status-codes';
import { Reviews } from '../models/review';
import { internalError, reviewNotFoundError } from '../errors/constantsErrors';

const reviewRepository = (): Repository<Reviews> => getRepository(Reviews);

export async function findReview(options?: FindConditions<Reviews>): Promise<any> {
    await reviewRepository().findOne(options)
    .then( (review: Reviews) => { return review })
    .catch( () => { throw new HandlerError(reviewNotFoundError, HttpStatus.NOT_FOUND) } )
  }

export async function createAndSave(review: Reviews): Promise<Reviews> {
    return await reviewRepository().save(review)
        .then((newEvent: Reviews) => { return newEvent; })
        .catch(() => { throw new HandlerError(internalError, HttpStatus.INTERNAL_SERVER_ERROR); });
}

export async function deleteReview(eventId: string): Promise<DeleteResult | void> {
  const reviewIdNumber: number = Number.parseInt(eventId);
  await reviewRepository().delete(reviewIdNumber);
  } 

  export async function modify(review: Reviews): Promise<Reviews | void> {
    await reviewRepository().update({id: review.id}, {comment: review.comment, classification: review.classification})
    .then( () => { return review })
    .catch( () => { throw new HandlerError(internalError, HttpStatus.INTERNAL_SERVER_ERROR) });
}

export default {
    findReview,
    createAndSave,
    deleteReview,
    modify
  };
