import { HandlerError } from '../errors/handlerError';
import { Response, NextFunction, Request } from 'express';
import HttpStatus from 'http-status-codes';

import { getRepository, Repository } from "typeorm";
import { eventNotFoundError, idsRequered, relationNotExist } from '../errors/constantsErrors';
import { PossibleContacts } from '../models/possibleContact';
import { Events } from '../models/event';
import { Carers } from '../models/carerUser';
import { Familiars } from '../models/familiarUser';

const possibleContactsRepository = (): Repository<PossibleContacts> => getRepository(PossibleContacts);
const EventsRepository = (): Repository<Events> => getRepository(Events);

export async function contactFound (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const familiar = req.query.familiarId as Familiars;
        const carer = req.query.carerId as Carers;
        if ( familiar !== undefined || carer !== undefined){
            const possibleContacts: PossibleContacts | undefined = await possibleContactsRepository().findOne({carer: carer, familiar: familiar, relationConfirmated: 0});
            if( possibleContacts === undefined ) {
                throw new HandlerError(relationNotExist, HttpStatus.NOT_FOUND);
            } else {
                const event: Events | undefined = await EventsRepository().findOne({familiar: possibleContacts.familiar.id, carer: possibleContacts.carer as Carers, day: req.query.eventDay as number, status: 0})
                if(event !== undefined){
                    let now = new Date();
                    if (event.expirationDate === undefined || now < new Date(event.expirationDate)) {
                        const startDate = new Date()
                        startDate.setHours(Number.parseInt(event.startEvent.split(":")[0]), Number.parseInt(event.startEvent.split(":")[1]))
                        const endDate = new Date()
                        endDate.setHours(Number.parseInt(event.endEvent.split(":")[0]), Number.parseInt(event.endEvent.split(":")[1]))
                        if(now.getHours() > startDate.getHours() && now.getHours() < endDate.getHours()){
                            res.status(HttpStatus.OK).send( {
                                latitude: event.carer.latitudeCurrent,
                                longitude: event.carer.longitudeCurrent
                            });
                        } else {
                            throw new HandlerError("It is not an authorized schedule", HttpStatus.BAD_REQUEST);        
                        }
                    } else {
                        throw new HandlerError("The event is expired", HttpStatus.BAD_REQUEST);
                    }
                } else {
                    throw new HandlerError(eventNotFoundError, HttpStatus.BAD_REQUEST);        
                }
            }
        } else {
            throw new HandlerError(idsRequered, HttpStatus.BAD_REQUEST);
        }
    } catch (e) {
        const error: HandlerError = e as HandlerError;
        res.status(error.getErrorCode()).send( {message: error.getMessage()} );
    }
}

