import { NextFunction, Request, Response } from 'express';
import HttpStatus from 'http-status-codes';

import diaryService from '../services/diary';
import { HandlerError } from '../errors/handlerError';
import { Diary } from '../models/diary';

export async function createDiary(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const diary: Diary = new Diary(req.body.idUser, []);
    return await diaryService
        .createAndSave(diary)
        .then( () => res.status(HttpStatus.CREATED).send({ diary }))
        .catch( (error: HandlerError) => {
          res.status(error.gerErrorCode()).send( {message: error.getMessage()} );
          next();
        });
  }

export async function deleteDiary(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    return await diaryService
        .deleteDiary(req.params.diaryId)
        .then( () => res.status(HttpStatus.NO_CONTENT))
        .catch( (error: HandlerError) => {
        res.status(error.gerErrorCode()).send( {message: error.getMessage()} );
        next();
    });
}