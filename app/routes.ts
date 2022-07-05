import { Application } from 'express';

import { validatePasswordMiddleware } from './middlewares/validatePassword';
import { modifyFamiliarUser, createFamiliarUser, modifyPassword, getFamiliarUserByDni } from './controllers/user';
import { modifyCarerUser, createCarerUser, getCarerUserByDni } from './controllers/user';
import { userFound, userNotFound } from './middlewares/userFound';
import { validateDni, validateSchemaUser } from './middlewares/schemaUser';
import { addHeaderCarer } from './middlewares/setTypeUser';

export const init = (app: Application): void => {
  app.put('/familiarUser', [validateDni, userFound], modifyFamiliarUser);
  app.put('/changePassword', [validateDni, userFound, validatePasswordMiddleware], modifyPassword);
  app.post('/familiarUsers', [validateSchemaUser, userNotFound ], createFamiliarUser);
  app.get('/familiarUsers/:dniNumber',  getFamiliarUserByDni);
  app.put('/carerUser', [addHeaderCarer, validateDni, userFound], modifyCarerUser);
  app.post('/carerUsers', [addHeaderCarer, validateSchemaUser, userNotFound ], createCarerUser);
  app.get('/carerUsers/:dniNumber', getCarerUserByDni);
};
