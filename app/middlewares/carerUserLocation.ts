import { Response, Request } from 'express';

import { HandlerError } from '../errors/handlerError';
import HttpStatus from 'http-status-codes';

import { aditionalUserNotFoundError } from '../errors/constantsErrors';
import { getRepository, Repository } from 'typeorm';
import { Carers } from '../models/carerUser';
import { Users } from '../models/user';

const carerUserRepository = (): Repository<Carers> => getRepository(Carers);

export async function updateLocation (req: Request, res: Response): Promise<void> {
    try {
        const carerUser: Carers | undefined = await carerUserRepository().findOne({user: req.body.user as Users});
        if( carerUser === undefined ) {
            throw new HandlerError(aditionalUserNotFoundError, HttpStatus.NOT_FOUND);
        } else {
            if(carerUser.latitudeCurrent !== req.body.latitudeCurrent || carerUser.longitudeCurrent !== req.body.longitudeCurrent){
                carerUser.setLatitudeCurrent(req.body.latitudeCurrent)
                carerUser.setLongitudeCurrent(req.body.longitudeCurrent)
                await carerUserRepository().update({id: carerUser.id}, carerUser)
            }
            res.status(HttpStatus.OK).send( {user: carerUser} );
        }
    } catch (e) {
        const error: HandlerError = e as HandlerError;
        res.status(error.getErrorCode()).send( {message: error.getMessage()} );
    }
}
