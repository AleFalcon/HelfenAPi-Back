import { getRepository, FindConditions, Repository } from 'typeorm';
import { Familiars } from '../models/familiarUser';
import { Carers } from '../models/carerUser';
import { Users } from '../models/user';

import { HandlerError } from '../errors/handlerError';
import { userNotFoundError } from '../errors/constantsErrors';
import HttpStatus from 'http-status-codes';

import bcrypt from 'bcrypt';

const familiarUserRepository = (): Repository<Familiars> => getRepository(Familiars);
const carerUserRepository = (): Repository<Carers> => getRepository(Carers);
const userRepository = (): Repository<Users> => getRepository(Users);

const actionSave = new Map<number, any>([
  [1, async ({id}: any) => await familiarUserRepository().save(new Familiars(id))],
  [2, async ({amountCare, price, specialty, experience, id}: any)=> await carerUserRepository().save(new Carers(amountCare, price, id, experience, specialty))]
]);

const actionFind = new Map<number, any>([
  [1, async (options: FindConditions<Familiars>) => await familiarUserRepository().findOne(options)],
  [2, async (options: FindConditions<Carers>)=> await carerUserRepository().findOne(options)]
]);

const actionUpdate = new Map<number, any>([
  [1, async (searchId: string, modifications: Familiars) => await familiarUserRepository().update(searchId, modifications) ],
  [2, async (searchId: string, modifications: Carers)=> await carerUserRepository().update(searchId, modifications)]
]);

export async function findUser(type: number, options?: FindConditions<Users>): Promise<any> {
  return await userRepository().findOne(options)
  .then( (user: Users) => {
    const aditionalInformation: Familiars | Carers | undefined = actionFind.get(type)({ userId: user.id });
    return {...user, ...aditionalInformation};
  })
  .catch( () => { throw new HandlerError(userNotFoundError, HttpStatus.NOT_FOUND) });

}

export async function createAndSave({userType: type, name, lastName, dateOfBirth, dniNumber, localAddress, mail, phoneNumber, password,
  postalCode, province, apartment, floor, amountCare, price, specialty, experience }: any): Promise<any> {
  const user: Users = new Users(name, lastName, dateOfBirth, dniNumber, localAddress,
    mail, phoneNumber, bcrypt.hashSync(password, bcrypt.genSaltSync(10)), postalCode, province, apartment,
    floor);
  const userCreated = await userRepository().save(user)
  const userTypeCreated: Familiars | Carers = await actionSave.get(type)({amountCare, price, specialty, experience, id: userCreated.id});
  return {...user, ...userTypeCreated};
}

export async function modifyPassword(userId: number, newPassword: string): Promise<void> {
  userRepository().update({id: userId}, {password: bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10))})
}

export async function modify(type: number, params: any): Promise<any> {
  const user: Users = Users.builder(params.user);
  user.modifyData(params.user);
  userRepository().update({id: params.userId}, user);
  const aditionalInformation: Familiars | Carers | undefined = await actionFind.get(type)({ userId: user.id });
  if (aditionalInformation === undefined){
    throw new HandlerError(userNotFoundError, HttpStatus.NOT_FOUND) 
  } else {
    aditionalInformation.modifyData(params)
    await actionUpdate.get(type)({id: aditionalInformation.id}, aditionalInformation );
    return {...user, ...aditionalInformation};
  }
}

/*  
//export function findAll(options?: FindManyOptions): Promise<User[]> {
//  return userRepository().find(options);
//}

*/

export default {
  //findAll,
  modify,
  modifyPassword,
  findUser,
  createAndSave
};
