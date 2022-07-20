import { NextFunction, Request, Response } from 'express';
import HttpStatus from 'http-status-codes';

import userService from '../services/users';

import { Familiars } from '../models/familiarUser';
import { Carers } from '../models/carerUser';
import { HandlerError } from '../errors/handlerError';

export async function getUserByDni(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  return await userService
  .findUser(Number.parseInt(req.body.userType), { dniNumber: req.params.dniNumber })
  .then((user: any ) => { return res.send(user) })
  .catch( (error: HandlerError) => {
    res.status(error.getErrorCode()).send( {message: error.getMessage()} );
    next();
  });
}

export async function createUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  return await userService
      .createAndSave(req.body)
      .then( (user: Familiars | Carers) => res.status(HttpStatus.CREATED).send({ user }))
      .catch( (error: any) => {
        res.status(error.codes).send( {message: error} );
        next();
      });
}

export async function modifyPassword(req: Request, res: Response, next: NextFunction): Promise<Response| void> {
  return await userService.modifyPassword(req.body.userId, req.body.newPassword)
    .then( ( ) => res.status(HttpStatus.ACCEPTED).send())
    .catch( (error: any) => {
    res.status(error.getErrorCode()).send( {message: error.getMessage()} );
    next();
  })
}

export async function modifyUser(req: Request, res: Response, next: NextFunction): Promise<Response| void> {
  return await userService
  .modify(Number.parseInt(req.body.type), req.body)
  .then( (user: any) => res.status(HttpStatus.OK).send({ user }))
  .catch( (error: any) => {
    res.status(400).send( {message: error.message} );
    next();
  })
}
