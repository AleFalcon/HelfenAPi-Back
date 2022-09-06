import { internalError } from '../errors/constantsErrors';
import { HandlerError } from '../errors/handlerError';
import { DeleteResult, getRepository, Repository } from 'typeorm';
import { Events } from '../models/event';
import HttpStatus from 'http-status-codes';

const eventRepository = (): Repository<Events> => getRepository(Events);

export async function createAndSave(events: Events[]): Promise<Events[]> {
  const newEvents: Events[] = []
  for(let count = 0; count < events.length ; count++){
    newEvents.push(await eventRepository().save(events[count]))
  }
  return newEvents;
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
