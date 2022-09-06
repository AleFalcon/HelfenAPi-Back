import { HandlerError } from '../errors/handlerError';
import { Response, NextFunction, Request } from 'express';
import HttpStatus from 'http-status-codes';

import { getRepository, Repository } from "typeorm";
import { relationNotExist } from '../errors/constantsErrors';
import { PossibleContacts } from '../models/possibleContact';
import { Carers } from '../models/carerUser';

const relationRepository = (): Repository<PossibleContacts> => getRepository(PossibleContacts);

export async function relationFound (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const carer: Carers = req.body.carer as Carers
        await relationRepository().findOne({carer: carer})
            .then( (relation: PossibleContacts) => {
                if(relation.familiar.id === req.body.familiar.id){
                    return next();
                } else {
                    throw new HandlerError(relationNotExist, HttpStatus.NOT_FOUND)
                }
            })
            .catch( () => { throw new HandlerError(relationNotExist, HttpStatus.NOT_FOUND) })
    } catch (e) {
        const error: HandlerError = e as HandlerError;
        res.status(error.getErrorCode()).send( {message: error.getMessage()} );
    }
}