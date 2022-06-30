import { Response, NextFunction, Request } from 'express';
import { BAD_REQUEST } from 'http-status-codes';
import { Event } from '../models/event';
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
    missingFields = validateGenericParameter(req.body.userIdCarer, missingFields, 'userIdCarer');
    missingFields = validateGenericParameter(req.body.userIdCare, missingFields, 'userIdCare');
    missingFields = validateGenericParameter(req.body.startTime, missingFields, 'startTime');
    missingFields = validateGenericParameter(req.body.endTime, missingFields, 'endTime');
    missingFields = validateGenericParameter(req.body.expirationDate, missingFields, 'expirationDate');
    missingFields = validateGenericParameter(req.body.day, missingFields, 'day');
    if (missingFields.length > 0){
        const missing = missingFields.substring(0, missingFields.length-2);
        const error = new HandlerError(`All fields are required. Missing fields: ${missing}`, BAD_REQUEST);
        res.status(error.gerErrorCode()).send( {message: error.getMessage()} );
    } else {
        next();
    }
}
