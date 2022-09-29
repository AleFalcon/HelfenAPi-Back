import { carerType } from '../constants/globalConstants';
import { Response, NextFunction, Request } from 'express';
import { BAD_REQUEST } from 'http-status-codes';

import { HandlerError } from '../errors/handlerError';
import { allFieldRequered } from '../errors/constantsErrors';

function validateGenericParameter(parameterValue: string, missingFields: string, parameterName: string): string {
    if (parameterValue === undefined || parameterValue  === ''){
        return missingFields = missingFields.concat(parameterName + ', ');
    } else {
        return missingFields;
    }
}

export function validateSchemaUser (req: Request, res: Response, next: NextFunction): void {
    let missingFields = '';
    missingFields = validateGenericParameter(req.body.name, missingFields, 'name');
    missingFields = validateGenericParameter(req.body.lastName, missingFields, 'lastName');
    missingFields = validateGenericParameter(req.body.dateOfBirth, missingFields, 'dateOfBirth');
    missingFields = validateGenericParameter(req.body.dniNumber, missingFields, 'dniNumber');
    missingFields = validateGenericParameter(req.body.localAddress, missingFields, 'localAddress');
    missingFields = validateGenericParameter(req.body.postalCode, missingFields, 'postalCode');
    missingFields = validateGenericParameter(req.body.province, missingFields, 'province');
    missingFields = validateGenericParameter(req.body.mail, missingFields, 'mail');
    missingFields = validateGenericParameter(req.body.gender, missingFields, 'gender');
    missingFields = validateGenericParameter(req.body.phoneNumber, missingFields, 'phoneNumber');
    missingFields = validateGenericParameter(req.body.password, missingFields, 'password');
    missingFields = validateGenericParameter(req.body.isNurse, missingFields, 'isNurse');
    missingFields = validateGenericParameter(req.body.specialty, missingFields, 'specialty');

    if (req.body.userType === carerType) {
        missingFields = validateGenericParameter(req.body.price, missingFields, 'price');
    }
    
    if (missingFields.length > 0){
        const missing = missingFields.substring(0, missingFields.length-2);
        const error = new HandlerError(allFieldRequered + missing, BAD_REQUEST);
        res.status(error.getErrorCode()).send( {message: error.getMessage()} );
    } else {
        next();
    }
}

export function validateDni (req: Request, res: Response, next: NextFunction): void {
    if (req.body.dniNumber === undefined) {
        const error = new HandlerError("Dni number is required.", BAD_REQUEST);
        res.status(error.getErrorCode()).send( {message: error.getMessage()} );
    } else {
        next();
    }
}
