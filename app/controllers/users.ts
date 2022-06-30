import { NextFunction, Request, Response } from 'express';
import HttpStatus from 'http-status-codes';

import userService from '../services/users';
import { User } from '../models/user';
import bcrypt from 'bcrypt';
import { HandlerError } from '../errors/handlerError';

export async function getUserByDni(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  return await userService
    .findUser({ dniNumber: req.params.dniNumber })
    .then((user: User) => { return res.send(user) })
    .catch( (error: HandlerError) => {
      res.status(error.gerErrorCode()).send( {message: error.getMessage()} );
      next();
    });
  }

export async function modifyPassword(req: Request, res: Response, next: NextFunction): Promise<Response| void> {
  const user: User = req.body.user as User;
  user.password = bcrypt.hashSync(req.body.newPassword, bcrypt.genSaltSync(10));
  return await userService.modify(user)
    .then( () => res.status(HttpStatus.OK).send({ user }))
    .catch( (error: HandlerError) => {
    res.status(error.gerErrorCode()).send( {message: error.getMessage()} );
    next();
  })
}

export async function modifyUser(req: Request, res: Response, next: NextFunction): Promise<Response| void> {
  const user: User = { name: req.body.name, lastName: req.body.lastName, dateOfBirth: req.body.dateOfBirth, dniNumber: req.body.dniNumber,
    localAddress: req.body.localAddress, mail: req.body.mail, phoneNumber: req.body.phoneNumber } as User;
  return await userService
    .modify(user)
    .then( () => res.status(HttpStatus.OK).send({ user }))
    .catch( (error: HandlerError) => {
      res.status(error.gerErrorCode()).send( {message: error.getMessage()} );
      next();
    })
}

export async function createUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  const user: User = new User(req.body.userType, req.body.name, req.body.lastName, req.body.dateOfBirth, req.body.dniNumber,
    req.body.localAddress, req.body.mail, req.body.phoneNumber, bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)));
  return await userService
      .createAndSave(user)
      .then( () => res.status(HttpStatus.CREATED).send({ user }))
      .catch( (error: HandlerError) => {
        res.status(error.gerErrorCode()).send( {message: error.getMessage()} );
        next();
      });
}
