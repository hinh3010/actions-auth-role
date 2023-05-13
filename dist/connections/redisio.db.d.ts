import { type IContext } from '@hellocacbantre/context';
import { SimpleFalcon, SimpleRedlock } from '@hellocacbantre/redis';
export declare const getFalcol: (context: IContext) => SimpleFalcon;
export declare const getRedlock: (context: IContext) => SimpleRedlock;
