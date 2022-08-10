import { DeleteResult, getRepository, Repository } from 'typeorm';
import { Services } from '../models/service';

const serviceRepository = (): Repository<Services> => getRepository(Services);

export async function createAndSave(service: Services): Promise<Services> {
  return await serviceRepository().save(service);
}

export async function deleteService(serviceId: string): Promise<DeleteResult | void> {
  const serviceIdNumber: number = Number.parseInt(serviceId);
  await serviceRepository().delete(serviceIdNumber);
  } 

export default {
    createAndSave,
    deleteService
  };