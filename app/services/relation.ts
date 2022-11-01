import { internalError } from '../errors/constantsErrors';
import { HandlerError } from '../errors/handlerError';
import { DeleteResult, FindConditions, getRepository, Repository } from 'typeorm';
import { PossibleContacts } from '../models/possibleContact';
import HttpStatus from 'http-status-codes';

const possibleContactsRepository = (): Repository<PossibleContacts> => getRepository(PossibleContacts);

export async function savePossibleContact(possibleContacts: PossibleContacts): Promise<PossibleContacts | void> {
    return await possibleContactsRepository().save(possibleContacts)
    .then((newPossibleContacts: PossibleContacts) => { return newPossibleContacts })
    .catch( () => { throw new HandlerError(internalError, HttpStatus.INTERNAL_SERVER_ERROR) });
}

export async function updateRelation(possibleContacts: PossibleContacts): Promise<PossibleContacts | void> {
    return await possibleContactsRepository().update({id: possibleContacts.id}, possibleContacts)
    .then( () => { return possibleContacts })
    .catch( () => { throw new HandlerError(internalError, HttpStatus.INTERNAL_SERVER_ERROR) });
}

export async function findContacts(options?: FindConditions<PossibleContacts>): Promise<PossibleContacts[]> {
    const list =  await possibleContactsRepository().find(options)
    .then((possibleContactsList: PossibleContacts[]) => { return possibleContactsList})
    .catch(() => { throw new HandlerError(internalError, HttpStatus.INTERNAL_SERVER_ERROR)})
    list.forEach(elem => {
        if (elem.contactConfirmated === 1 && elem.carer !== undefined) {
            elem.carer.user.phoneNumber = "XXXX"
        }
    })
    return list;
}

export async function findNotificationContacts(options?: FindConditions<PossibleContacts>): Promise<PossibleContacts[]> {
    return await possibleContactsRepository().find(options)
    .then((possibleContactsList: PossibleContacts[]) => { 
        return possibleContactsList
    })
    .catch(() => { throw new HandlerError(internalError, HttpStatus.INTERNAL_SERVER_ERROR)})
}

export async function findNotificationRelations(options?: FindConditions<PossibleContacts>): Promise<PossibleContacts[]> {
    return await possibleContactsRepository().find(options)
    .then((possibleContactsList: PossibleContacts[]) => { 
        return possibleContactsList
    })
    .catch(() => { throw new HandlerError(internalError, HttpStatus.INTERNAL_SERVER_ERROR)})
}

export async function deleteRelation(relationId: number): Promise<DeleteResult | void> {
    await possibleContactsRepository().delete(relationId)
}

export default {
    savePossibleContact,
    updateRelation,
    findNotificationContacts,
    findNotificationRelations,
    deleteRelation,
    findContacts
  };