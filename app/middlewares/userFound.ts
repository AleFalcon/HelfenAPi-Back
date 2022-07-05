import { Response, NextFunction, Request } from 'express';

import { HandlerError } from '../errors/handlerError';
import HttpStatus from 'http-status-codes';
import { FamiliarUsers } from '../models/familiarUser';
import { CarerUser } from '../models/carerUser';

import { mailExistsError, phoneExistsError, userExistsError, userNotFoundError } from '../errors/constantsErrors';
import { getTypeUser, userRepository } from './setTypeUser';



export async function userFound (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const user: FamiliarUsers | CarerUser | undefined = await userRepository(getTypeUser(res))
            .findOne({dniNumber: req.body.dniNumber});
        if( user === undefined ) {
            throw new HandlerError(userNotFoundError, HttpStatus.NOT_FOUND);
        } else {
            req.body.user = user;
            return next();
        }
    } catch (e) {
        const error: HandlerError = e as HandlerError;
        res.status(error.gerErrorCode()).send( {message: error.getMessage()} );
    }
}

export async function userNotFound (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        let user: FamiliarUsers | CarerUser | undefined = await userRepository(getTypeUser(res)).findOne({dniNumber: req.body.dniNumber});
        if( user === undefined ) {
            user = await userRepository(getTypeUser(res)).findOne({mail: req.body.mail});
            if( user === undefined ) {
                user = await userRepository(getTypeUser(res)).findOne({phoneNumber: req.body.phoneNumber});
                if( user === undefined ) {
                    return next();
                } else {
                    throw new HandlerError(phoneExistsError, HttpStatus.NOT_ACCEPTABLE);
                } 
            } else {
                throw new HandlerError(mailExistsError, HttpStatus.NOT_ACCEPTABLE);
            } 
        } else {
            throw new HandlerError(userExistsError, HttpStatus.NOT_ACCEPTABLE);
        }
    } catch (e) {
        const error: HandlerError = e as HandlerError;
        res.status(error.gerErrorCode()).send( {message: error.getMessage()} );
    }
}