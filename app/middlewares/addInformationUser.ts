import { Response, NextFunction, Request } from 'express';

import { HandlerError } from '../errors/handlerError';
import HttpStatus from 'http-status-codes';
import { aditionalUserNotFoundError } from '../errors/constantsErrors';
import userService from '../services/users';
import { Users } from '../models/user';

export async function addInformationUser (req: Request, res: Response, next: NextFunction): Promise<void | Response<any>> {
    try {
        const addInformation = await userService.findUserComplete(req.body.user as Users)
        if (addInformation === undefined){
            throw new HandlerError(aditionalUserNotFoundError, HttpStatus.INTERNAL_SERVER_ERROR);
        } else {
            return res.status(HttpStatus.ACCEPTED).send({ user: addInformation })
        }
    } catch (e) {
        const error: HandlerError = e as HandlerError;
        res.status(error.getErrorCode()).send( {message: error.getMessage()} );
    }
}