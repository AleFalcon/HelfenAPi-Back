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
    await eventRepository().update({id: event.id}, {day: event.day, startEvent: event.startEvent, endEvent: event.endEvent, 
      expirationDate: event.expirationDate, notes: event.notes, localAddress: event.localAddress, status: event.status })
    .then( () => { return event })
    .catch( (e) => { throw new HandlerError(e.message, HttpStatus.INTERNAL_SERVER_ERROR) });
}

export async function modifyList(newEvent: Events, note: string): Promise<void> {
  const events: Events[] | void = await eventRepository().find({familiar: newEvent.familiar, carer: newEvent.carer, startEvent: newEvent.startEvent, endEvent: newEvent.endEvent})
  if(events) {
    for(let event of events) {
      event.setNote(note)
      await eventRepository().update({id: event.id}, {day: event.day, startEvent: event.startEvent, endEvent: event.endEvent, 
        expirationDate: event.expirationDate, notes: event.notes, localAddress: event.localAddress, status: event.status })
      }
  }
}

export async function acceptList(newEvent: Events): Promise<void> {
  const events: Events[] | void = await eventRepository().find({familiar: newEvent.familiar, carer: newEvent.carer, startEvent: newEvent.startEvent, endEvent: newEvent.endEvent})
  if(events) {
    for(let event of events) {
      await eventRepository().update({id: event.id}, {day: event.day, startEvent: event.startEvent, endEvent: event.endEvent, 
        expirationDate: event.expirationDate, notes: event.notes, localAddress: event.localAddress, status: 0 })
      }
  }
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
  let listDays: string[] = []
  list.forEach((elem: Events) => {
    elem.days.forEach((numberDay: number) => {
        const day = new Date()
        let desplazamiento: number = 0
        if (day.getDay() !== numberDay) {
          desplazamiento = numberDay - day.getDay()
        }
        day.setDate(day.getDate() + desplazamiento)
        generateListDays(day, elem.date, elem.expirationDate).forEach((day: string) => listDays.push(day))
      })
      elem.stringDays = listDays.sort()
      listDays = []
    })
  return list
}

function generateListDays(initialDay: Date, initialDate: string, expirationDate?: string): string[]{
  const listDays: string[] = []
  const expiration = (expirationDate !== undefined) ? new Date(expirationDate) : undefined
  const startDate = new Date(initialDate)
  var nextDay = new Date();
  for(let count = 0 ; count < 10 ; count++){
    nextDay.setDate(initialDay.getDate() + (count * 7));
    if (nextDay > startDate) {
      if (expiration === undefined || nextDay < expiration){
        let stringDay: string = nextDay.toISOString().split('T')[0]
        listDays.push(stringDay)
      } else {
        count = 10
      }
    }
  }
  return listDays
}

export default {
    createAndSave,
    modify,
    deleteEvent,
    modifyList,
    acceptList,
    generateDates
  };
