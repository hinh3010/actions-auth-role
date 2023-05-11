"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRedlock = exports.getFalcol = exports.getRedisIoClient = void 0;
const redis_1 = require("@hellocacbantre/redis");
const getRedisIoClient = (uri) => {
    return (0, redis_1.createConnect)(uri);
};
exports.getRedisIoClient = getRedisIoClient;
const getFalcol = (context) => {
    const { redisDb } = context;
    const redisClient = (0, exports.getRedisIoClient)(redisDb.uri);
    const falcol = new redis_1.SimpleFalcon(redisClient);
    return falcol;
};
exports.getFalcol = getFalcol;
const getRedlock = (context) => {
    const { redisDb } = context;
    const redisClient = (0, exports.getRedisIoClient)(redisDb.uri);
    const redlock = new redis_1.SimpleRedlock([redisClient]);
    return redlock;
};
exports.getRedlock = getRedlock;
