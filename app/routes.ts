import { Application } from 'express';

import { createUser, getUserByDni, modifyPassword, modifyUser }  from './controllers/user';
import { createEvent, modifyEvent, deleteEvent, getEvent, getListEvent }  from './controllers/event';
import { userFound, userNotFound } from './middlewares/userFound';
import { validateSchemaUser } from './middlewares/schemaUser';
import { validatePasswordMiddleware } from './middlewares/validatePassword';
import { validateSchemaEvent, validateSchemaEventModify } from './middlewares/schemaEvent';
import { eventFound, eventFoundByParams, eventList } from './middlewares/eventFound';
import { carerUserFound } from './middlewares/carerUserFound';
import { reviewFound, reviewFoundByParam, reviewFoundByParams, reviewList } from './middlewares/reviewFound';
import { validateClassification, validateSchemaReview, validateSchemaReviewModify } from './middlewares/schemaReview';
import { userFounds } from './middlewares/usersFounds';
import { createReview, deleteReview, getListReview, getReview, modifyReview } from './controllers/reviews';

export const init = (app: Application): void => {
  app.put('/users', [userFound], modifyUser);
  app.post('/users', [validateSchemaUser, userNotFound], createUser);
  app.get('/users/:dniNumber',  getUserByDni);
  app.patch('/users', [userFound, validatePasswordMiddleware], modifyPassword);
  //---------------
  app.get('/event/:eventId', [eventFoundByParams], getEvent);
  app.get('/event/list/:userId', [eventList], getListEvent);
  app.post('/event', [validateSchemaEvent, carerUserFound], createEvent);
  app.put('/event',[validateSchemaEventModify, eventFound, carerUserFound], modifyEvent);
  app.delete('/event/:eventId', deleteEvent);
  //---------------
  app.get('/review/:reviewId', [reviewFoundByParams], getReview);
  app.get('/review/list/:carerId', [reviewList], getListReview);
  app.post('/review', [validateSchemaReview, validateClassification, userFounds], createReview);
  app.put('/review',[validateSchemaReviewModify, reviewFound], modifyReview);
  app.delete('/review/:reviewId', [reviewFoundByParam], deleteReview);
};
