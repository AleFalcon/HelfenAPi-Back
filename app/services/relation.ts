import { internalError } from '../errors/constantsErrors';
import { HandlerError } from '../errors/handlerError';
import { FindConditions, getRepository, Repository } from 'typeorm';
import { PossibleContacts } from '../models/possibleContact';
import HttpStatus from 'http-status-codes';

const possibleContactsRepository = (): Repository<PossibleContacts> => getRepository(PossibleContacts);

export async function savePossibleContact(possibleContacts: PossibleContacts): Promise<PossibleContacts | void> {
    return await possibleContactsRepository().save(possibleContacts)
    .then((newPossibleContacts: PossibleContacts) => { return newPossibleContacts })
    .catch( () => { throw new HandlerError(internalError, HttpStatus.INTERNAL_SERVER_ERROR) });
}

export async function updateRelation(possibleContacts: PossibleContacts): Promise<PossibleContacts | void> {
    return await possibleContactsRepository().update({carer: possibleContacts.carer, familiar: possibleContacts.familiar}, possibleContacts)
    .then( () => { return possibleContacts })
    .catch( () => { throw new HandlerError(internalError, HttpStatus.INTERNAL_SERVER_ERROR) });
}

export async function findContacts(options?: FindConditions<PossibleContacts>): Promise<PossibleContacts[]> {
    const list =  await possibleContactsRepository().find(options)
    .then((possibleContactsList: PossibleContacts[]) => { return possibleContactsList})
    .catch(() => { throw new HandlerError(internalError, HttpStatus.INTERNAL_SERVER_ERROR)})
    list.forEach(elem => {
        if (elem.contactConfirmated === 0 && elem.carer !== undefined) {
            elem.carer.user.phoneNumber = "XXXX"
        }
    })
    return list;
}

export default {
    savePossibleContact,
    updateRelation,
    findContacts
  };