import { Response, NextFunction, Request } from 'express';
import { BAD_REQUEST } from 'http-status-codes';
import { HandlerError } from '../errors/handlerError';

function validateGenericParameter(parameterValue: string, missingFields: string, parameterName: string): string {
    if (parameterValue === undefined || parameterValue  === ''){
        return missingFields = missingFields.concat(parameterName + ', ');
    } else {
        return missingFields;
    }
}

export function validateSchemaEvent (req: Request, res: Response, next: NextFunction): void {
    let missingFields = '';
    missingFields = validateGenericParameter(req.body.day, missingFields, 'day');
    missingFields = validateGenericParameter(req.body.date, missingFields, 'date');
    missingFields = validateGenericParameter(req.body.startEvent, missingFields, 'startEvent');
    missingFields = validateGenericParameter(req.body.endEvent, missingFields, 'endEvent');
    missingFields = validateGenericParameter(req.body.localAddress, missingFields, 'localAddress');
    if (missingFields.length > 0){
        const missing = missingFields.substring(0, missingFields.length-2);
        const error = new HandlerError(`All fields are required. Missing fields: ${missing}`, BAD_REQUEST);
        res.status(error.getErrorCode()).send( {message: error.getMessage()} );
    } else {
        next();
    }
}

export function validateSchemaEventModify (req: Request, res: Response, next: NextFunction): void {
    let missingFields = '';
    missingFields = validateGenericParameter(req.body.id, missingFields, 'id');
    if (missingFields.length > 0){
        const missing = missingFields.substring(0, missingFields.length-2);
        const error = new HandlerError(`All fields are required. Missing fields: ${missing}`, BAD_REQUEST);
        res.status(error.getErrorCode()).send( {message: error.getMessage()} );
    } else {
        next();
    }
}