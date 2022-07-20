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

export function validateSchemaDiary (req: Request, res: Response, next: NextFunction): void {
    let missingFields = '';
    missingFields = validateGenericParameter(req.body.userIdCarer, missingFields, 'userIdCarer');
    if (missingFields.length > 0){
        const missing = missingFields.substring(0, missingFields.length-2);
        const error = new HandlerError(`All fields are required. Missing fields: ${missing}`, BAD_REQUEST);
        res.status(error.getErrorCode()).send( {message: error.getMessage()} );
    } else {
        next();
    }
}