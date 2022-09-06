import { DeleteResult, FindConditions, getRepository, Repository } from 'typeorm';
import { Services } from '../models/service';
import { HandlerError } from '../errors/handlerError';
import { Carers } from '../models/carerUser';

const serviceRepository = (): Repository<Services> => getRepository(Services);

export async function createAndSave(service: Services): Promise<Services> {
  return await serviceRepository().save(service);
}

export async function deleteService(serviceId: string): Promise<DeleteResult | void> {
  const serviceIdNumber: number = Number.parseInt(serviceId);
  await serviceRepository().delete(serviceIdNumber);
  } 

function filterByGender(elem: Services, gender?: String): boolean{
  if(gender !== undefined) {
    if(gender === elem.carer.user.gender){
      return true;
    } else {
      return false
    }
  } else {
    return true;
  }
}

// function filterByServices(elem: Services, options?: String[]): boolean{
//   if(options !== undefined) {
//     if(elem.description.toString().includes(options.toString())){
//       return true;
//     } else {
//       return false
//     }
//   } else {
//     return true;
//   }
// }

function generateUserList(servicesList: Services[]): Carers[] {
  const aux: Carers[] = []
  servicesList.forEach((elem: Services) => {
    if (aux.length === 0){
      elem.carer.services = [elem]
      aux.push(elem.carer)
    } else {
      const pos = aux.find((elem1) => elem1.id === elem.carer.id)
      if( pos === undefined ){
        elem.carer.services = [elem]
        aux.push(elem.carer)
      } else {
        pos.services.push(elem)
      }
    }
  })
  return aux;

}


export async function findAllUserList(options?: String[], gender?: String): Promise<Carers[]> {
    const userServicesList: Services[] | undefined = await serviceRepository().find(undefined)
    const listFiltered = userServicesList.filter(( elem: Services )=> filterByGender(elem, gender))
    return generateUserList(listFiltered)
  }

export async function findBy(options?: FindConditions<Services>): Promise<any> {
    return await serviceRepository().find(options)
    .then((servicesList: Services[]) => { return servicesList})
    .catch((error) => {throw new HandlerError(error.message, error.getErrorCode)})
}

export default {
    createAndSave,
    deleteService,
    findBy,
    findAllUserList
  };