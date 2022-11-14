import { NextFunction, Request, Response } from 'express';
import HttpStatus from 'http-status-codes';

import eventService from '../services/event';
import userService from '../services/users';
import { HandlerError } from '../errors/handlerError';
import { Events } from '../models/event';
import { idRequered } from '../errors/constantsErrors';
import { Carers } from '../models/carerUser';
import { familiarType } from '../constants/globalConstants';

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
  return await eventService
    .modifyList(req.body.event as Events, req.body.notes)
    .then( () => {
      res.status(HttpStatus.NO_CONTENT).send() 
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

export async function getCalendar(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  const eventList: Events[] = (req.body.event as Events[]).filter((element: Events) => Events.convertAvailable(element.status) === true)
  const list: any = []
  for(let elem of eventService.generateDates(eventList)) {
    let user = await userService.findAditionalUser(familiarType, elem.familiar)
    list.push({...elem.convertToJson(), familiar: user, stringDays: elem.stringDays})
  }
  return res.status(HttpStatus.CREATED).send({ events: list})
  }

export function getListEvent(req: Request, res: Response, next: NextFunction): Response {
  const eventList: any[] = []
  req.body.event.forEach((element: Events) => {
    if(!Events.convertAvailable(element.status)) {
      eventList.push(Events.convertToJson(element));
    }
  });
  return res.status(HttpStatus.CREATED).send({ events: eventList });        
  }

export async function acceptEvent(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  return await eventService
    .acceptList(req.body.event as Events)
    .then( () => {
      res.status(HttpStatus.NO_CONTENT).send() 
    })
    .catch( (error: HandlerError) => {
      res.status(error.getErrorCode()).send( {message: error.getMessage()} );
      next();
    })
}
  