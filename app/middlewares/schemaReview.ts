import { allFieldRequered, classificationGraterThan0, classificationGraterThan5 } from '../errors/constantsErrors';
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

export function validateSchemaReview (req: Request, res: Response, next: NextFunction): void {
    let missingFields = '';
    missingFields = validateGenericParameter(req.body.carerId, missingFields, 'carerId');
    missingFields = validateGenericParameter(req.body.familiarId, missingFields, 'familiarId');
    missingFields = validateGenericParameter(req.body.classification, missingFields, 'classification');
    if (missingFields.length > 0){
        const missing = missingFields.substring(0, missingFields.length-2);
        const error = new HandlerError(allFieldRequered + missing, BAD_REQUEST);
        res.status(error.getErrorCode()).send( {message: error.getMessage()} );
    } else {
        next();
    }
}

export function validateClassification (req: Request, res: Response, next: NextFunction): void {
    const classification: number = req.body.classification;
    if (classification < 0 ) {
        const error = new HandlerError(classificationGraterThan0, BAD_REQUEST);
        res.status(error.getErrorCode()).send( {message: error.getMessage()} );
    }
    if (classification >= 5 ) {
        const error = new HandlerError(classificationGraterThan5, BAD_REQUEST);
        res.status(error.getErrorCode()).send( {message: error.getMessage()} );
    }
    next();
}

export function validateSchemaReviewModify (req: Request, res: Response, next: NextFunction): void {
    let missingFields = '';
    missingFields = validateGenericParameter(req.body.id, missingFields, 'id');
    missingFields = validateGenericParameter(req.body.familiarId, missingFields, 'familiarId');
    if (missingFields.length > 0){
        const missing = missingFields.substring(0, missingFields.length-2);
        const error = new HandlerError(allFieldRequered + missing, BAD_REQUEST);
        res.status(error.getErrorCode()).send( {message: error.getMessage()} );
    } else {
        next();
    }
}