import { type IContext } from '../@types';
export declare class PassportService {
    private readonly passport;
    private readonly context;
    constructor(context: IContext);
    private configureLocalStrategy;
    private configureJwtStrategy;
    authenticate(strategyName: string, options: object): any;
}
