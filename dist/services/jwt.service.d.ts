import Jwt, { type JwtPayload } from 'jsonwebtoken';
import { type ObjectId } from 'mongoose';
import { type IContext } from '@hellocacbantre/context';
export interface IPayload extends JwtPayload {
    _id: ObjectId;
}
export interface IJwtService {
    generateAccessToken: (payload: IPayload) => Promise<string | unknown>;
    generateRefreshToken: (payload: IPayload) => Promise<string | unknown>;
    verifyAccessToken: (token: string) => Promise<any>;
    verifyRefreshToken: (refreshToken: string) => Promise<any>;
}
export declare class JwtService implements IJwtService {
    private readonly context;
    constructor(context: IContext);
    generateAccessToken: (payload: IPayload) => Promise<string | unknown>;
    generateRefreshToken: (payload: IPayload) => Promise<string | unknown>;
    verifyAccessToken: (token: string) => Promise<string | Jwt.JwtPayload>;
    verifyRefreshToken: (refreshToken: string) => Promise<string | Jwt.JwtPayload>;
}
