import { NextFunction, Request, Response } from 'express';
import HttpStatus from 'http-status-codes';

import familiarUserService from '../services/familiarUsers';
import carerUserService from '../services/carerUsers';

import { FamiliarUsers } from '../models/familiarUser';
import bcrypt from 'bcrypt';
import { HandlerError } from '../errors/handlerError';
import { CarerUser } from '../models/carerUser';

export async function getFamiliarUserByDni(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  return await familiarUserService
    .findUser({ dniNumber: req.params.dniNumber })
    .then((user: FamiliarUsers) => { return res.send(user) })
    .catch( (error: HandlerError) => {
      res.status(error.gerErrorCode()).send( {message: error.getMessage()} );
      next();
    });
  }

export async function getCarerUserByDni(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  return await carerUserService
    .findUser({ dniNumber: req.params.dniNumber })
    .then((user: CarerUser) => { return res.send(user) })
    .catch( (error: HandlerError) => {
      res.status(error.gerErrorCode()).send( {message: error.getMessage()} );
      next();
    });
  }

export async function modifyPassword(req: Request, res: Response, next: NextFunction): Promise<Response| void> {
  const user: FamiliarUsers = req.body.user as FamiliarUsers;
  user.password = bcrypt.hashSync(req.body.newPassword, bcrypt.genSaltSync(10));
  return await familiarUserService.modify(user)
    .then( () => res.status(HttpStatus.OK).send({ user }))
    .catch( (error: HandlerError) => {
    res.status(error.gerErrorCode()).send( {message: error.getMessage()} );
    next();
  })
}

export async function modifyFamiliarUser(req: Request, res: Response, next: NextFunction): Promise<Response| void> {
  const user: FamiliarUsers = { name: req.body.name, lastName: req.body.lastName, dateOfBirth: req.body.dateOfBirth, dniNumber: req.body.dniNumber,
    localAddress: req.body.localAddress, mail: req.body.mail, phoneNumber: req.body.phoneNumber } as FamiliarUsers;
  return await familiarUserService
    .modify(user)
    .then( () => res.status(HttpStatus.OK).send({ user }))
    .catch( (error: HandlerError) => {
      res.status(error.gerErrorCode()).send( {message: error.getMessage()} );
      next();
    })
}

export async function modifyCarerUser(req: Request, res: Response, next: NextFunction): Promise<Response| void> {
  const user: CarerUser = { name: req.body.name, lastName: req.body.lastName, dateOfBirth: req.body.dateOfBirth, dniNumber: req.body.dniNumber,
    mail: req.body.mail, phoneNumber: req.body.phoneNumber, amountCate: req.body.amountCate, price: req.body.price } as CarerUser;
  return await carerUserService
    .modify(user)
    .then( () => res.status(HttpStatus.OK).send({ user }))
    .catch( (error: HandlerError) => {
      res.status(error.gerErrorCode()).send( {message: error.getMessage()} );
      next();
    })
}

export async function createFamiliarUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  const user: FamiliarUsers = new FamiliarUsers(req.body.name, req.body.lastName, req.body.dateOfBirth, req.body.dniNumber,
    req.body.localAddress, req.body.mail, req.body.phoneNumber, bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)));
  return await familiarUserService
      .createAndSave(user)
      .then( () => res.status(HttpStatus.CREATED).send({ user }))
      .catch( (error: HandlerError) => {
        res.status(error.gerErrorCode()).send( {message: error.getMessage()} );
        next();
      });
}

export async function createCarerUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  const user: CarerUser = new CarerUser(req.body.name, req.body.lastName, req.body.dateOfBirth, req.body.dniNumber,
    req.body.mail, req.body.phoneNumber, bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)), 0, req.body.price);
  return await carerUserService
      .createAndSave(user)
      .then( () => res.status(HttpStatus.CREATED).send({ user }))
      .catch( (error: HandlerError) => {
        res.status(error.gerErrorCode()).send( {message: error.getMessage()} );
        next();
      });
}
