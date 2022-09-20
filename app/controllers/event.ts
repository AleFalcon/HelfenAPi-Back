import { NextFunction, Request, Response } from 'express';
import HttpStatus from 'http-status-codes';

import eventService from '../services/event';
import { HandlerError } from '../errors/handlerError';
import { Events } from '../models/event';
import { idRequered } from '../errors/constantsErrors';
import { Carers } from '../models/carerUser';

export async function createEvent(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  const daysList: number[] = req.body.day as []
  const eventList: Events[] = []
  daysList.forEach((elem: number) => {
    eventList.push(new Events(req.body.carer as Carers, elem, req.body.date, req.body.startEvent,
      req.body.endEvent, req.body.localAddress, req.body.expirationDate, req.body.notes,
      req.body.status === undefined ? false : req.body.status, req.body.familiar))
  })
  return await eventService
      .createAndSave(eventList)
      .then( (newEvents: Events[]) => {
        const list: Events[] = []
        newEvents.forEach(elem => {list.push(elem.convertToJson())})
        res.status(HttpStatus.CREATED).send({ event: list })
      } )
      .catch( (error: any) => {
        const handlerError = new HandlerError(error, error.getErrorCode);
        res.status(handlerError.getErrorCode()).send( {message: handlerError.getMessage()} );
        next();
      });        
  }

export async function modifyEvent(req: Request, res: Response, next: NextFunction): Promise<Response| void> {
  const event: Events = Events.builder(req.body.carer as Carers, req.body);
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
    const error = new HandlerError (idRequered, HttpStatus.BAD_REQUEST)
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

export function getEvent(req: Request, res: Response): Response {
  return res.status(HttpStatus.CREATED).send({ event: Events.convertToJson(req.body.event) });        
  }

export function getListEvent(req: Request, res: Response, next: NextFunction): Response {
  const eventList: any[] = []
  req.body.event.forEach((element: any) => {
    eventList.push(Events.convertToJson(element));
  });
  return res.status(HttpStatus.CREATED).send({ events: eventList });        
  }

export async function acceptEvent(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  const event: Events = req.body.event as Events
  event.setStatus(true)
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
  