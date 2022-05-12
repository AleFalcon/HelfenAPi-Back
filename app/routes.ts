import { Application } from 'express';

import { validatePasswordMiddleware } from './middlewares/validatePassword';
import { modifyUser, createUser, modifyPassword, getUserByDni } from './controllers/users';
import { userFound, userNotFound } from './middlewares/userFound';
import { validateDni, validateSchemaUser } from './middlewares/schemaUser';

export const init = (app: Application): void => {
  app.put('/users', [validateDni, userFound], modifyUser);
  app.put('/changePassword', [validateDni, userFound, validatePasswordMiddleware], modifyPassword);
  app.post('/users', [validateSchemaUser, userNotFound ], createUser);
  app.get('/users/:dniNumber', getUserByDni);
};
