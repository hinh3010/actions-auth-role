import { SimpleFalcon, SimpleRedlock } from '@hellocacbantre/redis';
import { type Redis } from 'ioredis';
import { type IContext } from '../@types';
export declare const getRedisIoClient: (uri: string) => Redis;
export declare const getFalcol: (context: IContext) => SimpleFalcon;
export declare const getRedlock: (context: IContext) => SimpleRedlock;
