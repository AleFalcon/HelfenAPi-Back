import { getRepository, FindConditions, Repository } from 'typeorm';
import { Familiars } from '../models/familiarUser';
import { Carers } from '../models/carerUser';
import { Users } from '../models/user';

import serviceService from '../services/services';
import { HandlerError } from '../errors/handlerError';
import { aditionalUserNotFoundError, userNotFoundError } from '../errors/constantsErrors';
import HttpStatus from 'http-status-codes';

import bcrypt from 'bcrypt';
import { Services } from '../models/service';

const familiarUserRepository = (): Repository<Familiars> => getRepository(Familiars);
const carerUserRepository = (): Repository<Carers> => getRepository(Carers);
const userRepository = (): Repository<Users> => getRepository(Users);

const actionSave = new Map<number, any>([
  [1, async ({userCreated}: any) => await familiarUserRepository().save(new Familiars(userCreated))],
  [2, async ({amountCare, price, specialty, experience, userCreated}: any)=> await carerUserRepository().save(new Carers(amountCare, price, userCreated, experience, specialty))]
]);

const actionFind = new Map<number, any>([
  [1, async (options: FindConditions<Familiars>) => await familiarUserRepository().find(options)],
  [2, async (options: FindConditions<Carers>)=> await carerUserRepository().find(options)]
]);

const actionFindOne = new Map<number, any>([
  [1, async (options: FindConditions<Familiars>) => await familiarUserRepository().findOne(options)],
  [2, async (options: FindConditions<Carers>)=> await carerUserRepository().findOne(options)]
]);

const actionUpdate = new Map<number, any>([
  [1, async (searchId: string, modifications: Familiars) => await familiarUserRepository().update(searchId, modifications) ],
  [2, async (searchId: string, modifications: Carers)=> await carerUserRepository().update(searchId, modifications)]
]);

export async function findUser(type: number, options?: FindConditions<Users>): Promise<any> {
  const user: Users | void = await userRepository().findOne(options);
  if (user !== undefined) {
    const aditionalInformation: Familiars[] | Carers[] | undefined = await actionFind.get(type)({ userId: user.id });
    if(aditionalInformation !== undefined){
      return findInformationUser(aditionalInformation, user.id)
    } else {
      throw new HandlerError(aditionalUserNotFoundError, HttpStatus.NOT_FOUND)
    }
  } else {
    throw new HandlerError(userNotFoundError, HttpStatus.NOT_FOUND)
  }
}

function findInformationUser(aditionalInformation: Familiars[] | Carers[], userId: number): any{
    for(const elem of aditionalInformation) {
      if(elem.user.id === userId){
        return elem;
      }
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
  const aditionalInformation: Familiars[] | Carers[] | undefined = await actionFind.get(type)({ userId: user.id });
  if (aditionalInformation === undefined){
    throw new HandlerError(userNotFoundError, HttpStatus.NOT_FOUND) 
  } else {
    const userAditionalInformation: Familiars | Carers= findInformationUser(aditionalInformation, user.id)
    userAditionalInformation.modifyData(params)
    await actionUpdate.get(type)({id: userAditionalInformation.id}, userAditionalInformation );
    return userAditionalInformation;
  }
}

export async function modifyAditionalInformation(type: number, aditionalInformation: Carers): Promise<any> {
  return await actionUpdate.get(type)({id: aditionalInformation.id}, aditionalInformation );
}


export async function findUsersByServices(services?: String[], gender?: String): Promise<any> {
  const userServiceList: Services[] = await serviceService.findAll(services, gender);
  const userCarerList: Carers[] = [];
  for(const userService of userServiceList) {
    userCarerList.push(userService.carer)
  }
  return userCarerList;
}

export async function findAditionalUser(type: number, idUser: number): Promise<any> {
  const user: Carers | Familiars | undefined = await actionFindOne.get(type)({ id: idUser } as FindConditions<Carers>);
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
