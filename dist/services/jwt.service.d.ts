import Jwt, { type JwtPayload } from 'jsonwebtoken';
import { type ObjectId } from 'mongoose';
import { type IContext } from '../@types';
export interface IPayload extends JwtPayload {
    _id: ObjectId;
}
export declare class JwtService {
    private readonly context;
    constructor(context: IContext);
    generateAccessToken(payload: IPayload): Promise<string | unknown>;
    generateRefreshToken(payload: IPayload): Promise<string | unknown>;
    verifyAccessToken(token: string): Promise<string | Jwt.JwtPayload>;
    verifyRefreshToken(refreshToken: string): Promise<string | Jwt.JwtPayload>;
}
