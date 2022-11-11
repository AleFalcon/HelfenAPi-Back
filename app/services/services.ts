import { DeleteResult, FindConditions, getRepository, Repository } from 'typeorm';
import { Services } from '../models/service';
import { HandlerError } from '../errors/handlerError';
import { Carers } from '../models/carerUser';

const serviceRepository = (): Repository<Services> => getRepository(Services);

export async function createAndSave(carer: Carers, descriptions: string[]): Promise<Services[]> {
  const serviceList: Services[] = [];
  for(let description of descriptions){
    let service: Services = new Services(carer, description);
    await serviceRepository().save(service);
    serviceList.push(service)
  }
  return serviceList;
}

export async function deleteService(serviceId: string): Promise<DeleteResult | void> {
  const serviceIdNumber: number = Number.parseInt(serviceId);
  await serviceRepository().delete(serviceIdNumber);
  } 

function filterByGender(elem: Carers, gender?: String): boolean{
  if(gender !== "") {
    if(gender === elem.user.gender){
      return true;
    } else {
      return false
    }
  } else {
    return true;
  }
}

function filterByServices(elem: Carers, options?: String[]): boolean{
  if(options !== undefined) {
    const optionsFiltered = options.map(function(option) {
      if (elem.services.find((service: Services) => service.description === option) === undefined){
        return false;
      } else {
        return true;
      }
    });
    if(optionsFiltered.find((elem: boolean) => elem === false) === undefined){
      return true;
    } else {
      return false
    }
  } else {
    return true;
  }
}

function filterBySpecialty(elem: Carers, specialty: String): boolean{
    if(specialty !== "Ambos") {
      if(specialty === elem.convertSpeciality() || elem.convertSpeciality() === "Ambos"){
        return true;
      } else {
        return false
      }
    } else {
      return true;
    }
  }

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

export async function findAllUserList(latitude: string, longitude: string, specialty: string, options?: String[], gender?: String): Promise<any[]> {
  const userServicesList: Services[] | undefined = await serviceRepository().find(undefined)
  const listWithoutDuplicates = generateUserList(userServicesList); 
  const listFiltered = listWithoutDuplicates.filter(( elem: Carers )=> filterByGender(elem, gender) 
    && filterByServices(elem, options) && filterBySpecialty(elem, specialty))
  listFiltered.forEach((elem: Carers) => {
    elem.setDistance(getDistanciaKm(Number.parseFloat(latitude), Number.parseFloat(longitude), elem))
  })
  return listFiltered.sort((elem1, elem2) => elem1.distance - elem2.distance);
  }

  function getDistanciaKm(latitude: number, longitude: number, carer: Carers){
    const latitudeUser = Number.parseFloat(carer.user.getLatitude())
    const rad = function(x: number) {return x*Math.PI/180;}
    const earthRadius = 6378.137;
    var dLat = rad( latitudeUser - latitude );
    var dLong = rad( Number.parseFloat(carer.user.getLongitude()) - longitude );
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(rad(latitude)) * 
    Math.cos(rad(latitudeUser)) * Math.sin(dLong/2) * Math.sin(dLong/2)
    return earthRadius * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)))
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