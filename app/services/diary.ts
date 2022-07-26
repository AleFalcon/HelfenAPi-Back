import { internalError } from '../errors/constantsErrors';
import { HandlerError } from '../errors/handlerError';
import { DeleteResult, getRepository, Repository } from 'typeorm';
import { Diaries } from '../models/diary';
import HttpStatus from 'http-status-codes';

const diaryRepository = (): Repository<Diaries> => getRepository(Diaries);

export async function createAndSave(diary: Diaries): Promise<Diaries> {
    return await diaryRepository().save(diary)
    .then((newDiary: Diaries) => { return newDiary })
    .catch( (e) => { throw e }); 
      //throw new HandlerError(internalError, HttpStatus.INTERNAL_SERVER_ERROR) });
}

export async function deleteDiary(userIdCarer: string): Promise<DeleteResult | void> {
    return await diaryRepository().delete(userIdCarer)
    .then()
    .catch( () => { throw new HandlerError(internalError, HttpStatus.INTERNAL_SERVER_ERROR) });
  }

export default {
    createAndSave,
    deleteDiary
  };
