import { HandlerError } from '../errors/handlerError';
import { Response, NextFunction, Request } from 'express';
import HttpStatus from 'http-status-codes';

import { FindConditions, getRepository, Repository } from "typeorm";
import { Events } from "../models/event";
import { eventIdRequered, eventNotFoundError } from '../errors/constantsErrors';

const eventRepository = (): Repository<Events> => getRepository(Events);

export async function eventFound (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const eventId = req.body.id; 
        if ( eventId !== undefined ){
            const event: Events | undefined = await eventRepository().findOne({id: eventId});
            if( event === undefined ) {
                throw new HandlerError(eventNotFoundError, HttpStatus.NOT_FOUND);
            } else {
                req.body.event = event;
                return next();
            }
        } else {
            throw new HandlerError(eventIdRequered, HttpStatus.BAD_REQUEST);
        }
    } catch (e) {
        const error: HandlerError = e as HandlerError;
        res.status(error.getErrorCode()).send( {message: error.getMessage()} );
    }
}

export async function eventList (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const eventId = Number.parseInt(req.params.userId); 
        if ( eventId !== undefined ){
            const event: Events[] | undefined = await eventRepository().find({ carer: eventId as FindConditions<Events> });
            if( event === undefined ) {
                throw new HandlerError(eventNotFoundError, HttpStatus.NOT_FOUND);
            } else {
                req.body.event = event;
                return next();
            }
        } else {
            throw new HandlerError(eventIdRequered, HttpStatus.BAD_REQUEST);
        }
    } catch (e) {
        const error: HandlerError = e as HandlerError;
        res.status(error.getErrorCode()).send( {message: error.getMessage()} );
    }
}

export async function eventFoundByParams (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const eventId = Number.parseInt(req.params.eventId); 
        if ( eventId !== undefined ){
            const event: Events | undefined = await eventRepository().findOne({id: eventId});
            if( event === undefined ) {
                throw new HandlerError(eventNotFoundError, HttpStatus.NOT_FOUND);
            } else {
                req.body.event = event;
                return next();
            }
        } else {
            throw new HandlerError(eventIdRequered, HttpStatus.BAD_REQUEST);
        }
    } catch (e) {
        const error: HandlerError = e as HandlerError;
        res.status(error.getErrorCode()).send( {message: error.getMessage()} );
    }
}