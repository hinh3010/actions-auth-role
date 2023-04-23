import { ACCOUNT_ROLES_TYPE } from '@hellocacbantre/db-schemas';
import { type NextFunction, type Response } from 'express';
import { type Context, type CustomRequest } from './@types';
export declare class AuthRole {
    private readonly context;
    private readonly jwtService;
    constructor(context: Context);
    private refetchToken;
    isUser(req: CustomRequest, res: Response, next: NextFunction): Promise<void>;
    checkRole: (role: ACCOUNT_ROLES_TYPE) => (req: CustomRequest, res: Response, next: NextFunction) => Promise<void>;
    isUserActive(req: CustomRequest, res: Response, next: NextFunction): Promise<void>;
    isAdmin(req: CustomRequest, res: Response, next: NextFunction): Promise<void>;
    isSuperAdmin(req: CustomRequest, res: Response, next: NextFunction): Promise<void>;
}
