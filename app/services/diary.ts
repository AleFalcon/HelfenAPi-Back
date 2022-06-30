import { internalError } from '../errors/constantsErrors';
import { HandlerError } from '../errors/handlerError';
import { DeleteResult, getRepository, Repository } from 'typeorm';
import { Diary } from '../models/diary';
import HttpStatus from 'http-status-codes';

const diaryRepository = (): Repository<Diary> => getRepository(Diary);

export function createAndSave(diary: Diary): Promise<Diary> {
    return diaryRepository().save(diary);
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
