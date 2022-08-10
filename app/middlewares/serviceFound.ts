import { HandlerError } from '../errors/handlerError';
import { Response, NextFunction, Request } from 'express';
import HttpStatus from 'http-status-codes';

import { FindConditions, FindOneOptions, getRepository, Repository } from "typeorm";
import { idRequered, serviceNotFoundError } from '../errors/constantsErrors';
import { Services } from '../models/service';

const serviceRepository = (): Repository<Services> => getRepository(Services);

export async function serviceList (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const carerId = Number.parseInt(req.params.carerId); 
        if ( carerId !== undefined ){
            const services: Services[] | undefined = await serviceRepository().find({ carer: carerId as FindConditions<Services> });
            if( services === undefined ) {
                throw new HandlerError(serviceNotFoundError, HttpStatus.NOT_FOUND);
            } else {
                req.body.services = services;
                return next();
            }
        } else {
            throw new HandlerError(idRequered, HttpStatus.BAD_REQUEST);
        }
    } catch (e) {
        const error: HandlerError = e as HandlerError;
        res.status(error.getErrorCode()).send( {message: error.getMessage()} );
    }
}

export async function serviceFoundByParam (req: Request, res: Response, next: NextFunction): Promise<void> {
    const serviceId = req.params.serviceId; 
    if ( serviceId !== undefined ){
        if (await serviceRepository().findOne({id: serviceId} as FindOneOptions<Services>) === undefined) {
            const error: HandlerError = new HandlerError(serviceNotFoundError, HttpStatus.NOT_FOUND);
            res.status(error.getErrorCode()).send( {message: error.getMessage()} );
        } else {
            return next();
        }
    } else {
        const error: HandlerError = new HandlerError(idRequered, HttpStatus.BAD_REQUEST);
        res.status(error.getErrorCode()).send( {message: error.getMessage()} );
    }
}
