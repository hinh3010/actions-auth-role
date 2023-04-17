import Jwt, { type JwtPayload } from 'jsonwebtoken';
import { type ObjectId } from 'mongoose';
export interface IPayload extends JwtPayload {
    _id: ObjectId;
}
export declare class JwtService {
    generateAccessToken(payload: IPayload): Promise<string | unknown>;
    generateRefreshToken(payload: IPayload): Promise<string | unknown>;
    verifyAccessToken(token: string): Promise<string | Jwt.JwtPayload>;
    verifyRefreshToken(refreshToken: string): Promise<string | Jwt.JwtPayload>;
}
