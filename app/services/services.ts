//import { Carers } from '../models/carerUser';
import { Carers } from '../models/carerUser';
import { DeleteResult, FindConditions, FindOptionsUtils, getRepository, Repository } from 'typeorm';
import { Services } from '../models/service';

const serviceRepository = (): Repository<Services> => getRepository(Services);

class Aux {
  carer: Carers
  services: String[]

  constructor(carer: Carers, services: String[]){
    this.carer = carer;
    this.services = services;
  }
}

export async function createAndSave(service: Services): Promise<Services> {
  return await serviceRepository().save(service);
}

export async function deleteService(serviceId: string): Promise<DeleteResult | void> {
  const serviceIdNumber: number = Number.parseInt(serviceId);
  await serviceRepository().delete(serviceIdNumber);
  } 

export async function findAll(options?: String[], gender?: String): Promise<any> {
    const listaFinal: Aux[] = [];
    const userServicesList: Services[] | undefined = await serviceRepository().find(undefined);
    for(const userServices of userServicesList){
      if(gender === undefined || gender === userServices.carer.user.gender){
        const found = listaFinal.find(elem => elem.carer.id === userServices.carer.id)
        if (found === undefined) {
          listaFinal.push(new Aux(userServices.carer, [userServices.description]))
        } else {
          found.services.push(userServices.description)
        }
      }
    }
    if(options === undefined){
      return listaFinal
    } else {
      return listaFinal.filter(elem => elem.services.toString().includes(options.toString()));
    }
}

export default {
    createAndSave,
    deleteService,
    findAll
  };