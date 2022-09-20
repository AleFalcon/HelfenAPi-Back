import { Response, NextFunction, Request } from 'express';

import { HandlerError } from '../errors/handlerError';
import HttpStatus from 'http-status-codes';

import { Carers } from '../models/carerUser';
    
import userService from '../services/users';
import { userNotFoundError, userIdRequered } from '../errors/constantsErrors';
import { carerType } from '../constants/globalConstants';

export async function carerUserFound(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const carerId = req.body.carer;
        if ( carerId !== undefined ){
            const user: Carers = await userService.findAditionalUser(carerType, carerId )
            if( user === undefined ) {
                throw new HandlerError(userNotFoundError, HttpStatus.NOT_FOUND);
            } else {
                req.body.carer = user;
                return next();
            }
        } else {
            throw new HandlerError(userIdRequered, HttpStatus.BAD_REQUEST);
        }
    } catch (e) {
        const error: HandlerError = e as HandlerError;
        res.status(error.getErrorCode()).send( {message: error.getMessage()} );
    }
}
