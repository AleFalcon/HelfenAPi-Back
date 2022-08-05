import { NextFunction, Request, Response } from 'express';
import HttpStatus from 'http-status-codes';

import reviewService from '../services/review';

import { HandlerError } from '../errors/handlerError';
import { Reviews } from '../models/review';
import { idRequered } from '../errors/constantsErrors';

export async function getReview(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  return res.status(HttpStatus.CREATED).send({ review: Reviews.convertToJson(req.body.review) });        
}

export async function createReview(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  return await reviewService
      .createAndSave(new Reviews(req.body.carerId, req.body.familiarId, req.body.classification, req.body.comment))
      .then( (review: Reviews) => res.status(HttpStatus.CREATED).send({ review }))
      .catch( (error: any) => {
        const handlerError = new HandlerError(error, error.getErrorCode);
        res.status(handlerError.getErrorCode()).send( {message: handlerError.getMessage()} );
        next();
      });
    }

export async function deleteReview(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    if (req.params.reviewId === undefined) {
        const error = new HandlerError (idRequered, HttpStatus.BAD_REQUEST)
        res.status(error.getErrorCode()).send( {message: error.getMessage()} );
        next();
    } else {
        return await reviewService
            .deleteReview(req.params.reviewId)
            .then( () => res.status(HttpStatus.NO_CONTENT).send())
            .catch( (error: HandlerError) => {
            res.status(error.getErrorCode()).send( {message: error.getMessage()} );
            next();
        });
    }
}

export function getListReview(req: Request, res: Response): Response {
    const reviewsList: any[] = []
    req.body.reviews.forEach((element: any) => {
        reviewsList.push(Reviews.convertToJson(element));
    });
    return res.status(HttpStatus.CREATED).send({ reviews: reviewsList });        
}

export async function modifyReview(req: Request, res: Response, next: NextFunction): Promise<Response| void> {
    const review: Reviews = Reviews.builder(req.body.review as Reviews, req.body);
    return await reviewService
      .modify(review)
      .then( ( ) => {
        res.status(HttpStatus.OK).send({ review: review.convertToJson() }) 
      })
      .catch( (error: HandlerError) => {
        res.status(error.getErrorCode()).send( {message: error.getMessage()} );
        next();
      })
  }
