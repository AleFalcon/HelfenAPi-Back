import { Application } from 'express';

import { createUser, getUserByDni, getUserByServices, modifyPassword, modifyUser }  from './controllers/user';
import { createEvent, modifyEvent, deleteEvent, getEvent, getListEvent, acceptEvent }  from './controllers/event';
import { userFound, userFoundByEmail, userFoundByEmailForgetPassword, userNotFound } from './middlewares/userFound';
import { validateSchemaUser } from './middlewares/schemaUser';
import { passwordConfirm, passwordConfirmMiddleware, validatePasswordMiddleware } from './middlewares/validatePassword';
import { validateSchemaEvent, validateSchemaEventModify } from './middlewares/schemaEvent';
import { eventFound, eventFoundByParams, eventList } from './middlewares/eventFound';
import { carerUserFound } from './middlewares/carerUserFound';
import { reviewFound, reviewFoundByParam, reviewFoundByParams, reviewList } from './middlewares/reviewFound';
import { validateClassification, validateSchemaReview, validateSchemaReviewModify } from './middlewares/schemaReview';
import { userFounds } from './middlewares/usersFounds';
import { createReview, deleteReview, getListReview, getReview, modifyReview } from './controllers/reviews';
import { createService, deleteService, getListServices } from './controllers/service';
import { validateSchemaService } from './middlewares/schemaService';
import { serviceFoundByParam, serviceList } from './middlewares/serviceFound';
import { confirmateContact, confirmateRelation, createPossibleContact, createRelation, deleteContact, getNotificationContacts, getNotificationRelations, getPossibleContacts } from './controllers/relation';
import { relationFound } from './middlewares/relationFound';
import { updateLocation } from './middlewares/carerUserLocation';
import { contactFound } from './middlewares/possibleContactFound';

export const init = (app: Application): void => {
  app.post('/login', [userFoundByEmail, passwordConfirm]);
  app.patch('/forgetPassword', [userFoundByEmailForgetPassword, passwordConfirmMiddleware], modifyPassword);
  //---------------
  app.put('/user', [userFound], modifyUser);
  app.post('/user', [validateSchemaUser, userNotFound], createUser);
  app.get('/user/:dniNumber',  getUserByDni);
  app.patch('/user', [userFound, validatePasswordMiddleware], modifyPassword);
  app.get('/users',  getUserByServices);
  app.put('/location', [userFound, updateLocation]);
  app.get('/location', [contactFound]);
  //---------------
  app.get('/event/:eventId', [eventFoundByParams], getEvent);
  app.patch('/event/:eventId', [eventFoundByParams], acceptEvent);
  app.get('/events/:userId', [eventList], getListEvent);
  app.post('/event', [validateSchemaEvent, carerUserFound], createEvent);
  app.put('/event',[validateSchemaEventModify, eventFound, carerUserFound], modifyEvent);
  app.delete('/event/:eventId', deleteEvent);
  //---------------
  app.get('/review/:reviewId', [reviewFoundByParams], getReview);
  app.get('/reviews/:carerId', [reviewList], getListReview);
  app.post('/review', [validateSchemaReview, validateClassification, userFounds, relationFound], createReview);
  app.put('/review',[validateSchemaReviewModify, reviewFound], modifyReview);
  app.delete('/review/:reviewId', [reviewFoundByParam], deleteReview);
  //---------------
  app.post('/service', [validateSchemaService, carerUserFound], createService);
  app.get('/services/:carerId', [serviceList], getListServices);
  app.delete('/service/:serviceId', [serviceFoundByParam], deleteService);
  //---------------
  app.post('/contact', createPossibleContact);
  app.get('/contact/:carerId', getNotificationContacts);
  app.get('/contacts/:familiarId', getPossibleContacts);
  app.put('/contact/confirm', confirmateContact);
  app.delete('/contact/:relationId', deleteContact);
  app.get('/relation/:carerId', getNotificationRelations);
  app.put('/relation', createRelation);
  app.put('/relation/confirm', confirmateRelation);
};
