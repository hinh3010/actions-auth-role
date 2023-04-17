"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.platformDb = void 0;
const db_schemas_1 = require("@hellocacbantre/db-schemas");
const config_1 = require("../config");
const { URI, OPTIONS } = config_1.Env.MONGO_CONNECTION;
exports.platformDb = (0, db_schemas_1.newConnection)(URI, Object.assign(Object.assign({}, OPTIONS), { dbName: 'platform' }));
