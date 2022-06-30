import { NextFunction, Request, Response } from 'express';
import HttpStatus from 'http-status-codes';

import eventService from '../services/event';
import { HandlerError } from '../errors/handlerError';
import { Event } from '../models/event';

export async function createEvent(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const event: Event = new Event(req.body.diaryId, req.body.userIdCarer, req.body.userIdCare, req.body.day, req.body.startTime, req.body.endTime, req.body.expirationDate, req.body.notes);
    return await eventService
        .createAndSave(event)
        .then( () => res.status(HttpStatus.CREATED).send({ event }))
        .catch( (error: HandlerError) => {
          res.status(error.gerErrorCode()).send( {message: error.getMessage()} );
          next();
        });        
  }

export async function modifyEvent(req: Request, res: Response, next: NextFunction): Promise<Response| void> {
  const event: Event = new Event(req.body.diaryId, req.body.userIdCarer, req.body.userIdCare, req.body.day, req.body.startTime,
    req.body.endTime, req.body.expirationDate, req.body.notes);
  return await eventService
    .modify(event)
    .then( () => res.status(HttpStatus.OK).send({ event }))
    .catch( (error: HandlerError) => {
      res.status(error.gerErrorCode()).send( {message: error.getMessage()} );
      next();
    })
}

export async function deleteDiary(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    return await eventService
        .deleteEvent(req.params.eventId)
        .then( () => res.status(HttpStatus.NO_CONTENT))
        .catch( (error: HandlerError) => {
        res.status(error.gerErrorCode()).send( {message: error.getMessage()} );
        next();
    });
}
