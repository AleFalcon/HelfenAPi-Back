import { getRepository, FindConditions, Repository, DeepPartial } from 'typeorm';
import { FamiliarUsers } from '../models/familiarUser';
import { HandlerError } from '../errors/handlerError';
import { internalError, userNotFoundError } from '../errors/constantsErrors';
import HttpStatus from 'http-status-codes';

const userRepository = (): Repository<FamiliarUsers> => getRepository(FamiliarUsers);

export async function findUser(options?: FindConditions<FamiliarUsers>): Promise<FamiliarUsers | void> {
  const user: FamiliarUsers | undefined = await userRepository().findOne(options);
  if (user === undefined) {
    throw new HandlerError(userNotFoundError, HttpStatus.NOT_FOUND);
  }
  return user;
}

export function createAndSave(user: FamiliarUsers): Promise<FamiliarUsers> {
    return userRepository().save(user);
}

export async function modify(user: FamiliarUsers): Promise<FamiliarUsers | void> {
  await userRepository().update({dniNumber: user.dniNumber},user)
  .then( () => { return user })
  .catch( () => { throw new HandlerError(internalError, HttpStatus.INTERNAL_SERVER_ERROR) });
}
  
//export function findAll(options?: FindManyOptions): Promise<User[]> {
//  return userRepository().find(options);
//}

export function createMany(users: DeepPartial<FamiliarUsers>[]): Promise<FamiliarUsers[]> {
  return userRepository().save(users);
}

export default {
  //findAll,
  modify,
  createMany,
  findUser,
  createAndSave
};
