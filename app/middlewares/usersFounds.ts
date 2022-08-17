import { Response, NextFunction, Request } from 'express';

import { HandlerError } from '../errors/handlerError';
import HttpStatus from 'http-status-codes';

import { Carers } from '../models/carerUser';
    
import userService from '../services/users';
import { userNotFoundError } from '../errors/constantsErrors';
import { carerType, familiarType } from '../constants/globalConstants';
import { Familiars } from '../models/familiarUser';

export async function userFounds(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const carerId = req.body.carerId;
        const familiarId = req.body.familiarId;
        await userService.findAditionalUser(carerType, carerId)
        .then((carer: Carers) => { req.body.carer = carer; } )
        .catch( () => { throw new HandlerError(userNotFoundError, HttpStatus.NOT_FOUND) })
        
        await userService.findAditionalUser(familiarType, familiarId)
        .then((familiar: Familiars) => { req.body.familiar = familiar; } )
        .catch( () => { throw new HandlerError(userNotFoundError, HttpStatus.NOT_FOUND) })
            
        return next();
    } catch (e) {
        const error: HandlerError = e as HandlerError;
        res.status(error.getErrorCode()).send( {message: error.getMessage()} );
    }
}
