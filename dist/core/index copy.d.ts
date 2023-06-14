import { type IContext } from '@hellocacbantre/context';
import { ACCOUNT_ROLES_TYPE } from '@hellocacbantre/db-schemas';
import { type NextFunction, type Response } from 'express';
import { type ICustomRequest } from '../@types';
export declare class AuthRole {
    private readonly context;
    private readonly jwtService;
    constructor(context: IContext);
    isUser: (req: ICustomRequest, _: Response, next: NextFunction) => Promise<void>;
    isUserActive: (req: ICustomRequest, res: Response, next: NextFunction) => Promise<void>;
    checkRole: (role: ACCOUNT_ROLES_TYPE) => (req: ICustomRequest, res: Response, next: NextFunction) => Promise<void>;
    private readonly refetchToken;
    isAdmin: (req: ICustomRequest, res: Response, next: NextFunction) => Promise<void>;
    isSuperAdmin: (req: ICustomRequest, res: Response, next: NextFunction) => Promise<void>;
}
