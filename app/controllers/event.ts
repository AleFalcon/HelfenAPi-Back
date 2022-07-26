import { NextFunction, Request, Response } from 'express';
import HttpStatus from 'http-status-codes';

import eventService from '../services/event';
import { HandlerError } from '../errors/handlerError';
import { Events } from '../models/event';
import { eventIdRequered } from '../errors/constantsErrors';
import { Carers } from '../models/carerUser';

export async function createEvent(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  const event: Events = new Events(req.body.user as Carers, req.body.day, req.body.date, req.body.startEvent, req.body.endEvent, req.body.localAddress, req.body.expirationDate, req.body.notes);
  return await eventService
      .createAndSave(event)
      .then( (newEvent: Events) => {
        res.status(HttpStatus.CREATED).send({ event: newEvent.convertToJson() })
      } )
      .catch( (error: any) => {
        const handlerError = new HandlerError(error, error.getErrorCode);
        res.status(handlerError.getErrorCode()).send( {message: handlerError.getMessage()} );
        next();
      });        
  }

export async function modifyEvent(req: Request, res: Response, next: NextFunction): Promise<Response| void> {
  const event: Events = Events.builder(req.body.user as Carers, req.body);
  return await eventService
    .modify(event)
    .then( () => {
      res.status(HttpStatus.OK).send({ event: event.convertToJson() }) 
    })
    .catch( (error: HandlerError) => {
      res.status(error.getErrorCode()).send( {message: error.getMessage()} );
      next();
    })
}

export async function deleteEvent(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  if (req.params.eventId === undefined) {
    const error = new HandlerError (eventIdRequered, HttpStatus.BAD_REQUEST)
    res.status(error.getErrorCode()).send( {message: error.getMessage()} );
    next();
  } else {
    return await eventService
        .deleteEvent(req.params.eventId)
        .then( () => res.status(HttpStatus.NO_CONTENT).send())
        .catch( (error: HandlerError) => {
        res.status(error.getErrorCode()).send( {message: error.getMessage()} );
        next();
    });
  }
}

export async function getEvent(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  return res.status(HttpStatus.CREATED).send({ event: Events.convertToJson(req.body.event) });        
  }

export async function getListEvent(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  const eventList: any[] = []
  req.body.event.forEach((element: any) => {
    eventList.push(Events.convertToJson(element));
  });
  return res.status(HttpStatus.CREATED).send({ events: eventList });        
  }