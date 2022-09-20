import { HandlerError } from '../errors/handlerError';
import { Response, NextFunction, Request } from 'express';
import HttpStatus from 'http-status-codes';

import { getRepository, Repository } from "typeorm";
import { idsRequered, relationNotExist } from '../errors/constantsErrors';
import { PossibleContacts } from '../models/possibleContact';

const possibleContactsRepository = (): Repository<PossibleContacts> => getRepository(PossibleContacts);

export async function contactFound (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const familiarId = req.query.familiarId; 
        const carerId = req.query.carerId; 
        if ( familiarId !== undefined || carerId !== undefined){
            const possibleContacts: PossibleContacts | undefined = await possibleContactsRepository().findOne({carer: carerId, familiar: familiarId, relationConfirmated: 1});
            if( possibleContacts === undefined ) {
                throw new HandlerError(relationNotExist, HttpStatus.NOT_FOUND);
            } else {
                return next();
            }
        } else {
            throw new HandlerError(idsRequered, HttpStatus.BAD_REQUEST);
        }
    } catch (e) {
        const error: HandlerError = e as HandlerError;
        res.status(error.getErrorCode()).send( {message: error.getMessage()} );
    }
}

