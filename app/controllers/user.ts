import { NextFunction, Request, Response } from 'express';
import HttpStatus from 'http-status-codes';
import userService from '../services/users';
import { Familiars } from '../models/familiarUser';
import { Carers } from '../models/carerUser';
import { HandlerError } from '../errors/handlerError';
import { UploadedFile } from 'express-fileupload';
import path from 'path';

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

function uploadFiles(EDFile: UploadedFile) {
  const pathAbsolute = path.resolve(`./python/${EDFile.name}`)
  EDFile.mv(pathAbsolute,err => {
      if(err) throw new HandlerError(err.getMessage, HttpStatus.BAD_REQUEST);
  })
}

// eslint-disable-next-line @typescript-eslint/require-await
export async function saveImage(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try{
    if (req.files != undefined) {
      for(let count = 0; count < 2 ; count++){
        if(count === 0) {
          uploadFiles(req.files.file as UploadedFile)
        } else {
          uploadFiles(req.files.file1 as UploadedFile)
        }
      }
      res.status(HttpStatus.OK).send()
    }
  } catch (e) {
    res.status(500).send({ message : 'Need image :)' })
    next();
  }
}

export function checkUserId(req: Request, res: Response): Promise<Response | void> {
  console.log("controller");
  return userService.checkPythonScript(req.params.dniNumber)
  .then(result => {
    return res.status(HttpStatus.OK).send({ result })
  }) 
  .catch((error: HandlerError) => {
    return res.status(error.getErrorCode()).send( {message: error.getMessage()} )
  })
}