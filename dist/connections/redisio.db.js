"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRedlock = exports.getFalcol = void 0;
const redis_1 = require("@hellocacbantre/redis");
const getFalcol = (context) => {
    const { redisDb } = context;
    const falcol = new redis_1.SimpleFalcon(redisDb.instance);
    return falcol;
};
exports.getFalcol = getFalcol;
const getRedlock = (context) => {
    const { redisDb } = context;
    const redlock = new redis_1.SimpleRedlock([redisDb.instance]);
    return redlock;
};
exports.getRedlock = getRedlock;
