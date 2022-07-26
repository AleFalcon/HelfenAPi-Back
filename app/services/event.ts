import { internalError } from '../errors/constantsErrors';
import { HandlerError } from '../errors/handlerError';
import { DeleteResult, getRepository, Repository } from 'typeorm';
import { Events } from '../models/event';
import HttpStatus from 'http-status-codes';

const eventRepository = (): Repository<Events> => getRepository(Events);

export async function createAndSave(event: Events): Promise<Events> {
 return await eventRepository().save(event);
}

export async function modify(event: Events): Promise<Events | void> {
    await eventRepository().update({id: event.id}, event)
    .then( () => { return event })
    .catch( () => { throw new HandlerError(internalError, HttpStatus.INTERNAL_SERVER_ERROR) });
}


export async function deleteEvent(eventId: string): Promise<DeleteResult | void> {
  const eventIdNumber: number = Number.parseInt(eventId);
  await eventRepository().delete(eventIdNumber);
  } 

export default {
    createAndSave,
    modify,
    deleteEvent
  };
