import { Application } from 'express';

import { validatePasswordMiddleware } from './middlewares/validatePassword';
import { modifyUser, createUser, modifyPassword, getUserByDni } from './controllers/users';
import { createDiary, deleteDiary } from './controllers/diary';
import { userFound, userNotFound } from './middlewares/userFound';
import { validateDni, validateSchemaUser } from './middlewares/schemaUser';
import { validateSchemaEvent } from './middlewares/schemaEvent';
import { validateSchemaDiary } from './middlewares/schemaDiary';
import { diaryFound, diaryNotFound, diaryFoundDelete } from './middlewares/diaryFound';
import { eventFound, eventNotFound, listEventFound } from './middlewares/eventFound';
import { createEvent, modifyEvent, deleteEvent } from './controllers/event';

export const init = (app: Application): void => {
  app.put('/users', [validateDni, userFound], modifyUser);
  app.put('/changePassword', [validateDni, userFound, validatePasswordMiddleware], modifyPassword);
  app.post('/users', [validateSchemaUser, userNotFound ], createUser);
  app.get('/users/:dniNumber', getUserByDni);
  app.get('/diary/:userIdCarer', [diaryFound]);
  app.post('/diary/:userIdCarer', [validateSchemaDiary, diaryNotFound], createDiary)
  app.delete('/diary/:userIdCarer', [validateSchemaDiary, diaryFoundDelete], deleteDiary)
  app.get('/event/:eventId', [eventFound]);
  app.get('/event/list', [listEventFound]);
  app.post('/event', [validateSchemaEvent, eventNotFound], createEvent)
  app.put('/event', [validateSchemaEvent], modifyEvent);
  app.delete('/event/:eventId', [diaryFoundDelete], deleteEvent)
};
