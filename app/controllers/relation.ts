import { NextFunction, Request, Response } from 'express';
import HttpStatus from 'http-status-codes';

import relationService from '../services/relation';
import { HandlerError } from '../errors/handlerError';

import { Carers } from '../models/carerUser';
import { PossibleContacts } from "../models/possibleContact";
import { Familiars } from '../models/familiarUser';
import { FindConditions } from 'typeorm';

export async function createPossibleContact(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const possibleContacts: PossibleContacts = new PossibleContacts(req.body.carer as Carers, req.body.familiar as Familiars, 
        req.body.contactConfirmated, req.body.relationConfirmated);
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
    const possibleContacts: PossibleContacts = new PossibleContacts(req.body.carer as Carers, req.body.familiar as Familiars,
        req.body.contactConfirmated, req.body.relationConfirmated);
    return await relationService
        .updateRelation(possibleContacts)
        .then( (possibleContacts: PossibleContacts) => {
            res.status(HttpStatus.CREATED).send({ possibleContacts: possibleContacts.convertToJson() })
        } )
        .catch( (handlerError: HandlerError) => {
            res.status(handlerError.getErrorCode()).send( {message: handlerError.getMessage()} );
            next();
        });        
    }

export async function createRelation(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const possibleContacts: PossibleContacts = new PossibleContacts(req.body.carer as Carers, req.body.familiar as Familiars, true, true);
    return await relationService
        .updateRelation(possibleContacts)
        .then( (possibleContacts: PossibleContacts) => {
            res.status(HttpStatus.CREATED).send({ possibleContacts: possibleContacts.convertToJson() })
        } )
        .catch( (handlerError: HandlerError) => {
            res.status(handlerError.getErrorCode()).send( {message: handlerError.getMessage()} );
            next();
        });        
    }

export async function getPossibleContacts(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const familiarId = Number.parseInt(req.params.familiarId); 
    return await relationService
        .findContacts({ familiar: familiarId } as FindConditions<PossibleContacts>)
        .then( (possibleContactsList: PossibleContacts[]) => {
            res.status(HttpStatus.CREATED).send({ possibleContacts: possibleContactsList })
        } )
        .catch( (handlerError: any) => {
            res.status(handlerError.getErrorCode()).send( {message: handlerError.getMessage()} );
            next();
        });        
    }
    