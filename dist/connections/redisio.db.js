"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redlock = exports.falcol = exports.RedisIoClient = void 0;
const redis_1 = require("@hellocacbantre/redis");
const config_1 = require("../config");
exports.RedisIoClient = (0, redis_1.createConnect)(config_1.Env.REDIS_CONNECTION.URI);
exports.falcol = new redis_1.SimpleFalcon(exports.RedisIoClient);
exports.redlock = new redis_1.SimpleRedlock([exports.RedisIoClient]);
