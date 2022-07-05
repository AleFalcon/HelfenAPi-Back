import { CarerUser } from '../models/carerUser';
import { FamiliarUsers } from '../models/familiarUser';
import { Response, NextFunction, Request } from 'express';
import { getRepository } from 'typeorm';

export async function addHeaderCarer (req: Request, res: Response, next: NextFunction): Promise<void> {
    res.setHeader('carer', 'true');
    return next();
}

export function userRepository(header: Boolean): Repository<FamiliarUsers | CarerUser> {
    if ( header === true) {
        return getRepository(CarerUser);
   } else {
        return getRepository(FamiliarUsers);
   }
}

export function getTypeUser(res: Response): Boolean {
    return res.getHeader('carer') === 'true' ? true : false
}