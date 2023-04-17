import { type NextFunction, type Request, type Response } from 'express';
import { JwtService } from '../services/jwt.service';
import { ACCOUNT_ROLES_TYPE } from '@hellocacbantre/db-schemas';
interface CustomRequest extends Request {
    user?: Record<string, any>;
}
export declare class AuthRole {
    private readonly jwtService;
    constructor(jwtService?: JwtService);
    refetchToken: (req: CustomRequest, res: Response) => Promise<boolean>;
    isUser: (req: CustomRequest, res: Response, next: NextFunction) => Promise<void>;
    checkRole: (role: ACCOUNT_ROLES_TYPE) => (req: CustomRequest, res: Response, next: NextFunction) => Promise<void>;
    isUserActive: (req: CustomRequest, res: Response, next: NextFunction) => Promise<void>;
    isAdmin: (req: CustomRequest, res: Response, next: NextFunction) => Promise<void>;
    isSuperAdmin: (req: CustomRequest, res: Response, next: NextFunction) => Promise<void>;
}
export {};
