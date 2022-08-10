import { HandlerError } from '../errors/handlerError';
import { Response, NextFunction, Request } from 'express';
import HttpStatus from 'http-status-codes';

import { FindConditions, FindOneOptions, getRepository, Repository } from "typeorm";
import { idRequered, reviewNotFoundError, reviewNotMistmach } from '../errors/constantsErrors';
import { Reviews } from '../models/review';

const reviewRepository = (): Repository<Reviews> => getRepository(Reviews);

export async function reviewFound (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const reviewtId = req.body.id; 
        if ( reviewtId !== undefined ){
            await reviewRepository().findOne({id: reviewtId})
            .then( (review: Reviews) => { 
                req.body.review = review;
                if(review.id === req.body.review.id){
                    return next();
                } else {
                    throw new HandlerError(reviewNotMistmach, HttpStatus.NOT_FOUND)
                }
            })
            .catch( () => { throw new HandlerError(reviewNotFoundError, HttpStatus.NOT_FOUND); })
        } else {
            throw new HandlerError(idRequered, HttpStatus.BAD_REQUEST);
        }
    } catch (e) {
        const error: HandlerError = e as HandlerError;
        res.status(error.getErrorCode()).send( {message: error.getMessage()} );
    }
}

export async function reviewList (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const carerId = Number.parseInt(req.params.carerId); 
        if ( carerId !== undefined ){
            const reviews: Reviews[] | undefined = await reviewRepository().find({ carer: carerId as FindConditions<Reviews> });
            if( reviews === undefined ) {
                throw new HandlerError(reviewNotFoundError, HttpStatus.NOT_FOUND);
            } else {
                req.body.reviews = reviews;
                return next();
            }
        } else {
            throw new HandlerError(idRequered, HttpStatus.BAD_REQUEST);
        }
    } catch (e) {
        const error: HandlerError = e as HandlerError;
        res.status(error.getErrorCode()).send( {message: error.getMessage()} );
    }
}

export async function reviewFoundByParams (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const reviewId = Number.parseInt(req.params.reviewId); 
        if ( reviewId !== undefined ){
            const review: Reviews | undefined = await reviewRepository().findOne({id: reviewId});
            if( review === undefined ) {
                throw new HandlerError(reviewNotFoundError, HttpStatus.NOT_FOUND);
            } else {
                req.body.review = review;
                return next();
            }
        } else {
            throw new HandlerError(idRequered, HttpStatus.BAD_REQUEST);
        }
    } catch (e) {
        const error: HandlerError = e as HandlerError;
        res.status(error.getErrorCode()).send( {message: error.getMessage()} );
    }
}

export async function reviewFoundByParam (req: Request, res: Response, next: NextFunction): Promise<void> {
    const reviewtId = req.params.reviewId; 
    if ( reviewtId !== undefined ){
        if (await reviewRepository().findOne({id: reviewtId} as FindOneOptions<Reviews>) === undefined) {
            const error: HandlerError = new HandlerError(reviewNotFoundError, HttpStatus.NOT_FOUND);
            res.status(error.getErrorCode()).send( {message: error.getMessage()} );
        } else {
            return next();
    }
    } else {
        const error: HandlerError = new HandlerError(idRequered, HttpStatus.BAD_REQUEST);
        res.status(error.getErrorCode()).send( {message: error.getMessage()} );
    }
}