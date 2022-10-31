import { NextFunction, Request, Response } from 'express';
import HttpStatus from 'http-status-codes';
import userService from '../services/users';
import { Familiars } from '../models/familiarUser';
import { Carers } from '../models/carerUser';
import { HandlerError } from '../errors/handlerError';
import { UploadedFile } from 'express-fileupload';
import path from 'path';
import { pythonPath } from '../constants/globalConstants';
import { needImages } from '../errors/constantsErrors';
import reviewService from '../services/review';
import { FindCondition } from 'typeorm';
import { Reviews } from '../models/review';

export async function getUserByDni(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  return await userService
  .findUser(Number.parseInt(req.body.userType), { dniNumber: req.params.dniNumber })
  .then((user: Familiars | Carers ) => { 
    return res.send(user.convertToJson()) })
  .catch( (error: HandlerError) => {
    res.status(error.getErrorCode()).send( {message: error.getMessage()} );
    next();
  });
}

export async function createUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  return await userService
      .createAndSave(req.body)
      .then( (user: Familiars | Carers) => {
        const json = user.convertToJson()
        res.status(HttpStatus.CREATED).send({ user: json })
      })
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
  .then( (user: Familiars | Carers) => {
    const json = user.convertToJson()
    res.status(HttpStatus.OK).send({ json })})
  .catch( (error: any) => {
    const handlerError = new HandlerError(error, error.getErrorCode);
    res.status(handlerError.getErrorCode()).send( {message: handlerError.getMessage()} );
    next();
  })
}

export async function getUserByServices(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  return await userService.findUsersByServices(req.body.latitude, req.body.longitude, req.body.specialty ,req.body.description, req.body.gender)
  .then( async (carersList: Carers[]) => {
    const jsonList: any[] = []
    for(let element of carersList) {
      const reviews: Reviews[] = await reviewService.findAllReviews({ carer: element.id as FindCondition<Carers> })
      let qualification = reviews.length === 0 ? 3 : Reviews.calculateQualification(reviews);
      jsonList.push({ ...Carers.convertToJson(element), distance: element.distance, qualification: qualification })
    }
    res.status(HttpStatus.OK).send({carers: jsonList})
  })
  .catch( (error: any) => {
    const handlerError = new HandlerError(error, 400);
    res.status(handlerError.getErrorCode()).send( {message: handlerError.getMessage()} );
    next();
  })      
}

function uploadFiles(EDFile: UploadedFile) {
  const pathAbsolute = path.resolve(`./${pythonPath}${EDFile.name}`)
  EDFile.mv(pathAbsolute,err => {
      if(err) throw new HandlerError(err.getMessage, HttpStatus.BAD_REQUEST);
  })
}

const fileMap = new Map<number, any>([
  [0, (files: any) => uploadFiles(files.file as UploadedFile)],
  [1, (files: any) => uploadFiles(files.file1 as UploadedFile)],
  [2, (files: any) => uploadFiles(files.file2 as UploadedFile)],
  [3, (files: any) => uploadFiles(files.file3 as UploadedFile)]
]);


// eslint-disable-next-line @typescript-eslint/require-await
export async function saveImage(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try{
    console.log(req)
    if (req.files != undefined) {
      for(let count = 0; count < 4 ; count++){
        console.log("Inicio guardado " + count +"da imagen")
        fileMap.get(count)(req.files)
        console.log("Se guardo la " + count +"da imagen")
      }
      res.status(HttpStatus.OK).send()
    } else {
      res.status(HttpStatus.BAD_REQUEST).send({ message : needImages })
      next();  
    }
  } catch (e) {
    res.status(HttpStatus.BAD_REQUEST).send({ message : needImages })
    next();
  }
}

export async function checkUserId(req: Request, res: Response): Promise<Response | void> {
  return await userService.checkPythonScript(req.params.dniNumber)
    .then((result: boolean) => res.status(HttpStatus.OK).send({ result: result }) )
    .catch((error: HandlerError) => { return res.status(400).send({ message: error.getMessage() }) } )
}