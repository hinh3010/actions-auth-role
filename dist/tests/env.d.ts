export declare const Env: {
    NODE_ENV: string;
    MONGO_CONNECTION: {
        URI: string;
        OPTIONS: {
            useNewUrlParser: boolean;
            useUnifiedTopology: boolean;
            ssl: boolean;
            sslValidate: boolean;
            socketTimeoutMS: number;
            connectTimeoutMS: number;
            serverSelectionTimeoutMS: number;
            dbName: string;
        };
    };
    REDIS_CONNECTION: {
        URI: string;
    };
};
