import { NextFunction, Request, Response } from 'express';
import HttpStatus from 'http-status-codes';

import relationService from '../services/relation';
import { HandlerError } from '../errors/handlerError';

import { Carers } from '../models/carerUser';
import { PossibleContacts } from "../models/possibleContact";
import { Familiars } from '../models/familiarUser';
import { FindConditions } from 'typeorm';
import { relationNotExist } from '../errors/constantsErrors';

export async function createPossibleContact(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const possibleContacts: PossibleContacts = new PossibleContacts(req.body.carer as Carers, req.body.familiar as Familiars, false, null);
    return await relationService
        .savePossibleContact(possibleContacts)
        .then( (possibleContacts: PossibleContacts) => {
          res.status(HttpStatus.CREATED).send({ possibleContacts: possibleContacts.convertToJson() })
        } )
        .catch( (error: HandlerError) => {
          res.status(error.getErrorCode()).send( {message: error.getMessage()} );
          next();
        });        
    }

export async function confirmateContact(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const list: PossibleContacts[] = await relationService.findContacts({carer: req.body.carer as Carers, familiar: req.body.familiar as Familiars})
    const possibleContacts: PossibleContacts | undefined = list.find(elem => elem.contactConfirmated === 1)
    if (possibleContacts !== undefined){
        possibleContacts.setContactConfirmated(req.body.contactConfirmated);
        return await relationService
            .updateRelation(possibleContacts)
            .then( (possibleContacts: PossibleContacts) => {
                res.status(HttpStatus.CREATED).send({ possibleContacts: possibleContacts.convertToJson() })
            } )
            .catch( (handlerError: HandlerError) => {
                res.status(handlerError.getErrorCode()).send( {message: handlerError.getMessage()} );
                next();
            });        
        } else{
            const error = new HandlerError(relationNotExist, HttpStatus.NOT_FOUND);
            res.status(error.getErrorCode()).send( {message: error.getMessage()} );
            next();
        }
    }

export async function createRelation(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const list: PossibleContacts[] = await relationService.findContacts({carer: req.body.carer as Carers, familiar: req.body.familiar as Familiars, contactConfirmated: 0})
    const possibleContacts: PossibleContacts | undefined = list.find(elem => elem.relationConfirmated === null)
    if (possibleContacts !== undefined){
            possibleContacts.setRelationConfirmated(false)
            possibleContacts.setResume(req.body.resume)
            await relationService.updateRelation(possibleContacts)
            res.status(HttpStatus.CREATED).send({ possibleContacts: possibleContacts.convertToJson() })
        } else {
            const error = new HandlerError(relationNotExist, HttpStatus.NOT_FOUND);
            res.status(error.getErrorCode()).send( {message: error.getMessage()} );
            next();
        }
    }

export async function getPossibleContacts(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const familiarId = Number.parseInt(req.params.familiarId); 
    return await relationService
        .findContacts({ familiar: familiarId } as FindConditions<PossibleContacts>)
        .then( (possibleContactsList: PossibleContacts[]) => {
            const possibleContacts: PossibleContacts[] = [];
            possibleContactsList.forEach(elem => possibleContacts.push(elem.convertToJson()))
            res.status(HttpStatus.CREATED).send({ possibleContacts: possibleContacts })
        } )
        .catch( (handlerError: any) => {
            res.status(handlerError.getErrorCode()).send( {message: handlerError.getMessage()} );
            next();
        });        
    }
    
export async function getNotificationContacts(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const carerId = Number.parseInt(req.params.carerId); 
    return await relationService
        .findNotificationContacts({ carer: carerId, contactConfirmated: 1 } as FindConditions<PossibleContacts>)
        .then( (possibleContactsList: PossibleContacts[]) => {
            const possibleContacts: PossibleContacts[] = [];
            possibleContactsList.forEach(elem => possibleContacts.push(elem.convertToJson()))
            res.status(HttpStatus.CREATED).send({ possibleContacts: possibleContacts })
        } )
        .catch( (handlerError: any) => {
            res.status(handlerError.getErrorCode()).send( {message: handlerError.getMessage()} );
            next();
        });        
    }

export async function getNotificationRelations(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const carerId = Number.parseInt(req.params.carerId); 
    return await relationService
        .findNotificationRelations({ carer: carerId, contactConfirmated: 0, relationConfirmated: 1 } as FindConditions<PossibleContacts>)
        .then( (possibleContactsList: PossibleContacts[]) => {
            const possibleContacts: PossibleContacts[] = [];
            possibleContactsList.forEach(elem => possibleContacts.push(elem.convertToJson()))
            res.status(HttpStatus.CREATED).send({ possibleContacts: possibleContacts })
        } )
        .catch( (handlerError: any) => {
            res.status(handlerError.getErrorCode()).send( {message: handlerError.getMessage()} );
            next();
        });        
    }

export async function getCarerListByRelation(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const idFamiliar = Number.parseInt(req.params.familiarId); 
    return await relationService
        .findRelations({ familiar: idFamiliar, contactConfirmated: 0, relationConfirmated: 0 } as FindConditions<PossibleContacts>)
        .then( (possibleContactsList: PossibleContacts[]) => {
            const possibleContacts: PossibleContacts[] = [];
            possibleContactsList.forEach(elem => possibleContacts.push(elem.convertToJson()))
            res.status(HttpStatus.CREATED).send({ possibleContacts: possibleContacts })
        } )
        .catch( (handlerError: any) => {
            res.status(handlerError.getErrorCode()).send( {message: handlerError.getMessage()} );
            next();
        });        
    }

export async function deleteContact(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const relationId = Number.parseInt(req.params.relationId); 
    return await relationService
        .deleteRelation(relationId)
        .then( () => {
            res.status(HttpStatus.NO_CONTENT).send()
        } )
        .catch( (error: HandlerError) => {
            res.status(error.getErrorCode()).send( {message: error.getMessage()} );
            next();
        })
}

export async function confirmateRelation(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const list: PossibleContacts[] = await relationService.findContacts({carer: req.body.carer as Carers, familiar: req.body.familiar as Familiars, contactConfirmated: 0})
    const possibleContacts: PossibleContacts | undefined = list.find(elem => elem.relationConfirmated === 1)
    if (possibleContacts !== undefined){
        possibleContacts.setRelationConfirmated(req.body.relationConfirmated);
        return await relationService
            .updateRelation(possibleContacts)
            .then( (possibleContacts: PossibleContacts) => {
                res.status(HttpStatus.CREATED).send({ possibleContacts: possibleContacts.convertToJson() })
            } )
            .catch( (handlerError: HandlerError) => {
                res.status(handlerError.getErrorCode()).send( {message: handlerError.getMessage()} );
                next();
            });
        } else {
            const error = new HandlerError(relationNotExist, HttpStatus.NOT_FOUND);
            res.status(error.getErrorCode()).send( {message: error.getMessage()} );
            next();
        }        
    }