import { Application } from 'express';

import { createUser, getUserByDni, modifyPassword, modifyUser }  from './controllers/user';
import { createEvent, modifyEvent, deleteEvent, getEvent, getListEvent }  from './controllers/event';
import { userFound, userNotFound } from './middlewares/userFound';
import { validateSchemaUser } from './middlewares/schemaUser';
import { validatePasswordMiddleware } from './middlewares/validatePassword';
import { validateSchemaEvent, validateSchemaEventModify } from './middlewares/schemaEvent';
import { eventFound, eventFoundByParams, eventList } from './middlewares/eventFound';
import { carerUserFound } from './middlewares/carerUserFound';

export const init = (app: Application): void => {
  app.put('/users', [userFound], modifyUser);
  app.post('/users', [validateSchemaUser, userNotFound], createUser);
  app.get('/users/:dniNumber',  getUserByDni);
  app.patch('/users', [userFound, validatePasswordMiddleware], modifyPassword);
  app.get('/event/:eventId', [eventFoundByParams], getEvent);
  app.get('/event/list/:userId', [eventList], getListEvent);
  app.post('/event', [validateSchemaEvent, carerUserFound], createEvent);
  app.put('/event',[validateSchemaEventModify, eventFound, carerUserFound], modifyEvent);
  app.delete('/event/:eventId', deleteEvent);
};
