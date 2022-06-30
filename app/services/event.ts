import { internalError } from '../errors/constantsErrors';
import { HandlerError } from '../errors/handlerError';
import { DeleteResult, getRepository, Repository } from 'typeorm';
import { Event } from '../models/event';
import HttpStatus from 'http-status-codes';

const eventRepository = (): Repository<Event> => getRepository(Event);

export function createAndSave(event: Event): Promise<Event> {
    return eventRepository().save(event);
}

export async function modify(event: Event): Promise<Event | void> {
    await eventRepository().update({id: event.id}, event)
    .then( () => { return event })
    .catch( () => { throw new HandlerError(internalError, HttpStatus.INTERNAL_SERVER_ERROR) });
  }

export async function deleteEvent(eventId: string): Promise<DeleteResult | void> {
    return await eventRepository().delete(eventId)
    .then()
    .catch( () => { throw new HandlerError(internalError, HttpStatus.INTERNAL_SERVER_ERROR) });
  }

export default {
    createAndSave,
    modify,
    deleteEvent
  };
