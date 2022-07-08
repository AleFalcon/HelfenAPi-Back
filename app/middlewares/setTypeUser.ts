import { Carers } from '../models/carerUser';
import { Familiars } from '../models/familiarUser';
import { Response, NextFunction, Request } from 'express';
import { getRepository, Repository } from 'typeorm';

export function addHeaderCarer (req: Request, res: Response, next: NextFunction): void {
    res.setHeader('carer', 'true');
    next();
}

export function userRepository(header: boolean): Repository<Familiars | Carers> {
    if ( header ) {
        return getRepository(Carers);
   } else {
        return getRepository(Familiars);
   }
}

export function getTypeUser(res: Response): boolean {
    return res.getHeader('carer') === 'true';
}