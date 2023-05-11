import { type IContext } from '@hellocacbantre/context';
export declare class PassportService {
    private readonly passport;
    private readonly context;
    constructor(context: IContext);
    private configureLocalStrategy;
    private configureJwtStrategy;
    authenticate(strategyName: string, options: object): any;
}
