import { Application } from 'express';

import { createUser, getUserByDni, modifyPassword, modifyUser }  from './controllers/user';
import { userFound, userNotFound } from './middlewares/userFound';
import { validateSchemaUser } from './middlewares/schemaUser';
import { validatePasswordMiddleware } from './middlewares/validatePassword';

export const init = (app: Application): void => {
  app.put('/users', [userFound], modifyUser);
  app.post('/users', [validateSchemaUser, userNotFound], createUser);
  app.get('/users/:dniNumber',  getUserByDni);
  app.patch('/users', [userFound, validatePasswordMiddleware], modifyPassword);
};
