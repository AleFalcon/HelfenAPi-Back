import { Response, NextFunction, Request } from 'express';

import { getRepository, Repository } from 'typeorm';
import { HandlerError } from '../errors/handlerError';
import HttpStatus from 'http-status-codes';
import { Diary } from '../models/diary';
import { diaryExistsError, diaryNotFoundError } from '../errors/constantsErrors';

const diaryRepository = (): Repository<Diary> => getRepository(Diary);

export async function diaryFound (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const userId = Number(req.params.userIdCarer);
        const diary: Diary | undefined = await diaryRepository().findOne({ userIdCarer: userId });
        if( diary === undefined ) {
            throw new HandlerError(diaryNotFoundError, HttpStatus.NOT_ACCEPTABLE);
        }
        res.status(HttpStatus.OK).send( {diary} );
        next();
    } catch (e) {
        const error: HandlerError = e as HandlerError;
        res.status(error.gerErrorCode()).send( {message: error.getMessage()} );
    }
}

export async function diaryNotFound (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const userId = Number(req.params.userIdCarer);
        const diary: Diary | undefined = await diaryRepository().findOne({ userIdCarer: userId });
        if( diary !== undefined ) {
            throw new HandlerError(diaryExistsError, HttpStatus.NOT_ACCEPTABLE);
        }
        next();
    } catch (e) {
        const error: HandlerError = e as HandlerError;
        res.status(error.gerErrorCode()).send( {message: error.getMessage()} );
    }
}

export async function diaryFoundDelete (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const userId = Number(req.params.userIdCarer);
        const diary: Diary | undefined = await diaryRepository().findOne({ userIdCarer: userId });
        if( diary === undefined ) {
            throw new HandlerError(diaryNotFoundError, HttpStatus.NOT_ACCEPTABLE);
        }
        req.body.diary = diary;
        next();
    } catch (e) {
        const error: HandlerError = e as HandlerError;
        res.status(error.gerErrorCode()).send( {message: error.getMessage()} );
    }
}