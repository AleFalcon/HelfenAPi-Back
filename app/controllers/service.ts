import { idRequered } from '../errors/constantsErrors';
import { NextFunction, Request, Response } from 'express';
import HttpStatus from 'http-status-codes';

import { HandlerError } from '../errors/handlerError';
import { Services } from '../models/service';

import serviceService from '../services/services';
import { Carers } from '../models/carerUser';

export async function createService(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  return await serviceService
      .createAndSave(req.body.carer as Carers, req.body.description)
      .then( (services: Services[]) => {
        const list = []
        for(let service of services){
          list.push(service.convertToJson())
        }
        res.status(HttpStatus.CREATED).send({ service: list })
      } )
      .catch( (error: any) => {
        const handlerError = new HandlerError(error, error.getErrorCode);
        res.status(handlerError.getErrorCode()).send( {message: handlerError.getMessage()} );
        next();
      });        
  }

export function getListServices(req: Request, res: Response): Response {
    const servicesList: any[] = []
    req.body.services.forEach((element: any) => {
      servicesList.push(Services.convertToJson(element));
    });
    return res.status(HttpStatus.CREATED).send({ services: servicesList });        
}

export async function deleteService(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  const serviceId = req.params.serviceId;
  if (serviceId === undefined) {
      const error = new HandlerError (idRequered, HttpStatus.BAD_REQUEST)
      res.status(error.getErrorCode()).send( {message: error.getMessage()} );
      next();
  } else {
      return await serviceService
          .deleteService(serviceId)
          .then( () => res.status(HttpStatus.NO_CONTENT).send())
          .catch( (error: HandlerError) => {
          res.status(error.getErrorCode()).send( {message: error.getMessage()} );
          next();
      });
  }
}
