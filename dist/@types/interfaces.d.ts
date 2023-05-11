import { type Request } from 'express';
export interface IError {
    status: number;
    message: string;
}
export interface ICustomRequest extends Request {
    user?: Record<string, any>;
}
export interface IMongoContext {
    uri: string;
    options: Record<string, any>;
}
export interface IRedisContext {
    uri: string;
}
export interface IContext {
    mongoDb: IMongoContext;
    redisDb: IRedisContext;
}
