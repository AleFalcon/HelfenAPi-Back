import { getRepository, FindConditions, Repository, DeepPartial } from 'typeorm';
import { CarerUser } from '../models/carerUser';
import { HandlerError } from '../errors/handlerError';
import { internalError, userNotFoundError } from '../errors/constantsErrors';
import HttpStatus from 'http-status-codes';

const userRepository = (): Repository<CarerUser> => getRepository(CarerUser);

export async function findUser(options?: FindConditions<CarerUser>): Promise<CarerUser | void> {
  const user: CarerUser | undefined = await userRepository().findOne(options);
  if (user === undefined) {
    throw new HandlerError(userNotFoundError, HttpStatus.NOT_FOUND);
  }
  return user;
}

export function createAndSave(user: CarerUser): Promise<CarerUser> {
    return userRepository().save(user);
}

export async function modify(user: CarerUser): Promise<CarerUser | void> {
  await userRepository().update({dniNumber: user.dniNumber},user)
  .then( () => { return user })
  .catch( () => { throw new HandlerError(internalError, HttpStatus.INTERNAL_SERVER_ERROR) });
}
  
//export function findAll(options?: FindManyOptions): Promise<User[]> {
//  return userRepository().find(options);
//}

export function createMany(users: DeepPartial<CarerUser>[]): Promise<CarerUser[]> {
  return userRepository().save(users);
}

export default {
  //findAll,
  modify,
  createMany,
  findUser,
  createAndSave
};
