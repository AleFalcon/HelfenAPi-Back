import { Response, NextFunction, Request } from 'express';

import { HandlerError } from '../errors/handlerError';
import HttpStatus from 'http-status-codes';
import bcrypt from 'bcrypt';
import { matchPasswordError, newPasswordEqualsPasswordError, newPasswordError, passwordRequered } from '../errors/constantsErrors';

async function validatePassword(req: Request): Promise<void> {
    if (req.body.password === undefined){
        throw new HandlerError(passwordRequered, HttpStatus.BAD_REQUEST);
    }
    if (req.body.newPassword !== req.body.newPasswordConfirmation){
        throw new HandlerError(newPasswordError, HttpStatus.NOT_ACCEPTABLE);
    }
    if (!await bcrypt.compare(req.body.password, req.body.user.password)) {
        throw new HandlerError(matchPasswordError, HttpStatus.NOT_ACCEPTABLE);
    }
    if (req.body.password === req.body.newPassword) {
        throw new HandlerError(newPasswordEqualsPasswordError, HttpStatus.NOT_ACCEPTABLE);
    }
}

export async function passwordConfirmMiddleware (req: Request, res: Response, next: NextFunction): Promise<void> {
    if (req.body.newPassword !== req.body.newPasswordConfirmation){
        const error: HandlerError = new HandlerError(newPasswordError, HttpStatus.NOT_ACCEPTABLE);
        res.status(error.getErrorCode()).send( {message: error.getMessage()} );
    } else {
        next()
    }
}

export async function validatePasswordMiddleware (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        await validatePassword(req);
        return next();
    } catch (e) {
        const error: HandlerError = e as HandlerError;
        res.status(error.getErrorCode()).send( {message: error.getMessage()} );
    }
}

export async function passwordConfirm (req: Request, res: Response, next: NextFunction): Promise<void | Response<any>> {
    try {
        if ( !await bcrypt.compare(req.body.password, req.body.user.password)) {
            throw new HandlerError(matchPasswordError, HttpStatus.BAD_REQUEST);
        }
        return res.status(HttpStatus.ACCEPTED).send({ login: true })
    } catch (e) {
        const error: HandlerError = e as HandlerError;
        res.status(error.getErrorCode()).send( {message: error.getMessage()} );
    }
}