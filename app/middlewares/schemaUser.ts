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

export function validateSchemaUser (req: Request, res: Response, next: NextFunction): void {
    let missingFields = '';
    missingFields = validateGenericParameter(req.body.userType, missingFields, 'userType');
    missingFields = validateGenericParameter(req.body.name, missingFields, 'name');
    missingFields = validateGenericParameter(req.body.lastName, missingFields, 'lastName');
    missingFields = validateGenericParameter(req.body.dateOfBirth, missingFields, 'dateOfBirth');
    missingFields = validateGenericParameter(req.body.dniNumber, missingFields, 'dniNumber');
    missingFields = validateGenericParameter(req.body.localAddress, missingFields, 'localAddress');
    missingFields = validateGenericParameter(req.body.mail, missingFields, 'mail');
    missingFields = validateGenericParameter(req.body.phoneNumber, missingFields, 'phoneNumber');
    missingFields = validateGenericParameter(req.body.password, missingFields, 'password');
    if (missingFields.length > 0){
        const missing = missingFields.substring(0, missingFields.length-2);
        const error = new HandlerError(`All fields are required. Missing fields: ${missing}`, BAD_REQUEST);
        res.status(error.gerErrorCode()).send( {message: error.getMessage()} );
    } else {
        next();
    }
}

export function validateDni (req: Request, res: Response, next: NextFunction): void {
    if (req.body.dniNumber === undefined) {
        const error = new HandlerError("Dni number is required.", BAD_REQUEST);
        res.status(error.gerErrorCode()).send( {message: error.getMessage()} );
    } else {
        next();
    }
}
