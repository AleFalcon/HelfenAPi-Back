import { getRepository, FindConditions, Repository } from 'typeorm';
import { Familiars } from '../models/familiarUser';
import { Carers } from '../models/carerUser';
import { Users } from '../models/user';

import serviceService from '../services/services';
import reviewService from '../services/review';
import { HandlerError } from '../errors/handlerError';
import { aditionalUserNotFoundError, userNotFoundError } from '../errors/constantsErrors';
import HttpStatus from 'http-status-codes';

import bcrypt from 'bcrypt';

const familiarUserRepository = (): Repository<Familiars> => getRepository(Familiars);
const carerUserRepository = (): Repository<Carers> => getRepository(Carers);
const userRepository = (): Repository<Users> => getRepository(Users);

const actionSave = new Map<number, any>([
  [1, async ({userCreated}: any) => await familiarUserRepository().save(new Familiars(userCreated))],
  [2, async ({amountCare, price, specialty, experience, userCreated}: any)=> await carerUserRepository().save(new Carers(amountCare, price, userCreated, experience, specialty))]
]);

const actionFindUser = new Map<number, any>([
  [1, async (options: FindConditions<Users>) => await familiarUserRepository().findOne(options)],
  [2, async (options: FindConditions<Users>)=> await carerUserRepository().findOne(options)]
]);

const actionFindFull = new Map<number, any>([
  [1, (options: FindConditions<Familiars>) => findFamiliarUser(options)],
  [2, (options: FindConditions<Carers>) => findCarerUser(options)]
]);

async function findCarerUser(options: FindConditions<Carers>): Promise<Carers | undefined>{
  const carerUser = await carerUserRepository().findOne(options);
  if (carerUser !== undefined) {
    carerUser.services = await serviceService.findBy({ carer: carerUser });
    carerUser.reviews = await reviewService.findAllReviews({ carer: carerUser })
    return carerUser;
  } else {
    return undefined;
  }
}

async function findFamiliarUser(options: FindConditions<Familiars>): Promise<Familiars | undefined>{
  const familiarUser = await familiarUserRepository().findOne(options);
  if (familiarUser !== undefined){
    familiarUser.reviews = await reviewService.findReview({ familiar: familiarUser })
    return familiarUser
  } else {
    return undefined
  }
}

const actionUpdate = new Map<number, any>([
  [1, async (searchId: string, modifications: Familiars) => await familiarUserRepository().update(searchId, modifications) ],
  [2, async (searchId: string, modifications: Carers)=> await carerUserRepository().update(searchId, modifications)]
]);

export async function findUser(type: number, options?: FindConditions<Users>): Promise<any> {
  const user: Users | void = await userRepository().findOne(options);
  if (user !== undefined) {
    return await actionFindFull.get(type)({user: user});
  } else {
    throw new HandlerError(userNotFoundError, HttpStatus.NOT_FOUND)
  }
}

export async function createAndSave({userType: type, name, lastName, dateOfBirth, dniNumber, localAddress, mail, phoneNumber, password,
  postalCode, province, apartment, gender, floor, price, specialty, experience }: any): Promise<any> {
  const user: Users = new Users(name, lastName, dateOfBirth, dniNumber, localAddress,
    mail, phoneNumber, bcrypt.hashSync(password, bcrypt.genSaltSync(10)), postalCode, province, gender, apartment,
    floor);
  const userCreated = await userRepository().save(user)
  const userTypeCreated: Familiars | Carers = await actionSave.get(type)({amountCare: 0 , price, specialty, experience, userCreated});
  return userTypeCreated;
}

export async function modifyPassword(userId: number, newPassword: string): Promise<void> {
  await userRepository().update({id: userId}, {password: bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10))})
}

export async function modify(type: number, params: any): Promise<any> {
  const user: Users = Users.builder(params.user);
  user.modifyData(params);
  userRepository().update({id: params.userId}, user);
  const aditionalInformation: Familiars | Carers | undefined = await actionFindUser.get(type)({ userId: user.id });
  if (aditionalInformation === undefined){
    throw new HandlerError(userNotFoundError, HttpStatus.NOT_FOUND) 
  } else {
    aditionalInformation.modifyData(params)
    await actionUpdate.get(type)({id: aditionalInformation.id}, aditionalInformation );
    aditionalInformation.user = user
    return aditionalInformation;
  }
}

export async function modifyAditionalInformation(type: number, aditionalInformation: Carers): Promise<any> {
  return await actionUpdate.get(type)({id: aditionalInformation.id}, aditionalInformation );
}


export async function findUsersByServices(services?: String[], gender?: String): Promise<any> {
  return await serviceService.findAllUserList(services, gender)
}

export async function findAditionalUser(type: number, idUser: number): Promise<any> {
  const user: Carers | Familiars | undefined = await actionFindUser.get(type)({ id: idUser } as FindConditions<Carers>);
  if (user !== undefined) {
    return user;
  } else {
    throw new HandlerError(aditionalUserNotFoundError, HttpStatus.NOT_FOUND)
  }
}


export default {
  modify,
  modifyPassword,
  findUser,
  findAditionalUser,
  modifyAditionalInformation,
  createAndSave,
  findUsersByServices
};
