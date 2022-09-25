import { NextFunction, Request, Response } from 'express';
import HttpStatus from 'http-status-codes';
import userService from '../services/users';
import { Familiars } from '../models/familiarUser';
import { Carers } from '../models/carerUser';
import { HandlerError } from '../errors/handlerError';
import { UploadedFile } from 'express-fileupload';

export async function getUserByDni(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  return await userService
  .findUser(Number.parseInt(req.body.userType), { dniNumber: req.params.dniNumber })
  .then((user: Familiars | Carers ) => { 
    return res.send(user) })
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
        const handlerError = new HandlerError(error, error.getErrorCode);
        res.status(handlerError.getErrorCode()).send( {message: handlerError.getMessage()} );
        next();
      });
}

export async function modifyPassword(req: Request, res: Response, next: NextFunction): Promise<Response| void> {
  return await userService.modifyPassword(req.body.userId, req.body.newPassword)
    .then( ( ) => res.status(HttpStatus.ACCEPTED).send())
    .catch( (error: any) => {
      const handlerError = new HandlerError(error, error.getErrorCode);
    res.status(handlerError.getErrorCode()).send( {message: handlerError.getMessage()} );
    next();
  })
}

export async function modifyUser(req: Request, res: Response, next: NextFunction): Promise<Response| void> {
  return await userService
  .modify(Number.parseInt(req.body.userType), req.body)
  .then( (user: any) => res.status(HttpStatus.OK).send({ user }))
  .catch( (error: any) => {
    const handlerError = new HandlerError(error, error.getErrorCode);
    res.status(handlerError.getErrorCode()).send( {message: handlerError.getMessage()} );
    next();
  })
}

export async function getUserByServices(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  return await userService.findUsersByServices(req.body.latitude, req.body.longitude, req.body.description, req.body.gender)
  .then( (carersList: Carers[]) => {
    const jsonList: any[] = []
    carersList.forEach((element: Carers) => {
      jsonList.push({...Carers.convertToJson(element), distance: element.distance});
    });
    res.status(HttpStatus.OK).send({carers: jsonList})
  } )
  .catch( (error: any) => {
    const handlerError = new HandlerError(error, error.getErrorCode);
    res.status(handlerError.getErrorCode()).send( {message: handlerError.getMessage()} );
    next();
  })      
}

export function saveImage(req: Request, res: Response): Response | void {
  if (req.files != undefined) {
    const EDFile = req.files.file as UploadedFile
    EDFile.mv(`../python/${EDFile.name}`,err => {
      if(err) return res.status(500).send({ message : err })
      return res.status(200).send({ message : 'File upload' })
  })
  }
  return res.status(500).send({ message : 'Need image :)' })
}
