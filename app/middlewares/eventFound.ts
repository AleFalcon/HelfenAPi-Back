import { Response, NextFunction, Request } from 'express';

import { getRepository, Repository } from 'typeorm';
import { HandlerError } from '../errors/handlerError';
import { eventFoundError, eventNotFoundError } from '../errors/constantsErrors';
import { Event } from '../models/event';
import HttpStatus from 'http-status-codes';

const eventRepository = (): Repository<Event> => getRepository(Event);

export async function eventFound (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const event: Event | undefined = await eventRepository().findOne({ id: Number(req.params.eventId) });
        if( event === undefined ) {
            throw new HandlerError(eventNotFoundError, HttpStatus.NOT_ACCEPTABLE);
        }
        res.status(HttpStatus.OK).send( {event} );
        next();
    } catch (e) {
        const error: HandlerError = e as HandlerError;
        res.status(error.gerErrorCode()).send( {message: error.getMessage()} );
    }
}

export async function eventNotFound (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const userId = Number(req.params.userIdCarer);
        const day = Number(req.params.day);
        const event: Event | undefined = await eventRepository().findOne({ userIdCarer: userId, day: day, startTime: req.params.startTime,
            endTime: req.params.endTime });
        if( event !== undefined ) {
            throw new HandlerError(eventFoundError, HttpStatus.NOT_ACCEPTABLE);
        }
        res.status(HttpStatus.OK).send( {event} );
        next();
    } catch (e) {
        const error: HandlerError = e as HandlerError;
        res.status(error.gerErrorCode()).send( {message: error.getMessage()} );
    }
}

export async function listEventFound (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const userId = Number(req.params.userIdCarer);
        const event: Event[] | undefined = await eventRepository().find({ userIdCarer: userId});
        if( event === undefined ) {
            throw new HandlerError(eventNotFoundError, HttpStatus.NOT_ACCEPTABLE);
        }
        res.status(HttpStatus.OK).send( {eventList: event} );
        next();
    } catch (e) {
        const error: HandlerError = e as HandlerError;
        res.status(error.gerErrorCode()).send( {message: error.getMessage()} );
    }
}
