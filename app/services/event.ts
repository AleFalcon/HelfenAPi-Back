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

export function generateDates(events: Events[]): Events[] {
  const newList: Events[] = []
  events.forEach((elem: Events) => {
    if(newList.length === 0) {
      elem.days.push(elem.day)
      newList.push(elem)
    } else {
      const event = newList.find((elemt: Events) => elemt.familiar === elem.familiar)
      if ( event !== undefined) {
        event.days.push(elem.day)
      } else {
        elem.days.push(elem.day)
        newList.push(elem)
      }
    }
  })
  return generateDatesString(newList)
}

function generateDatesString(list: Events[]): Events[]{
  const listDays: string[] = []
  list.forEach((elem: Events) => {
    elem.days.forEach((numberDay: number) => {
        const day = new Date()
        let desplazamiento: number = 0
        if (day.getDay() !== numberDay) {
          desplazamiento = numberDay - day.getDay()
        }
        day.setDate(day.getDate() + desplazamiento)
        generateListDays(day, elem.expirationDate).forEach((day: string) => listDays.push(day))
      })
      elem.stringDays = listDays.sort()
    })
  return list
}

function generateListDays(initialDay: Date, expirationDate?: string): string[]{
  const listDays: string[] = []
  const expiration = (expirationDate !== undefined) ? new Date(expirationDate) : undefined
  for(let count = 0 ; count < 10 ; count++){
    var nextDay = new Date();
    nextDay.setDate(initialDay.getDate() + (count * 7));
    if ( expiration === undefined || nextDay < expiration ){
      let stringDay: string = nextDay.toISOString().split('T')[0]
      listDays.push(stringDay)
    } else {
      count = 10
    }
    
  }
  return listDays
}

export default {
    createAndSave,
    modify,
    deleteEvent,
    generateDates
  };
