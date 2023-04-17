"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConnection = exports.getModel = void 0;
const db_schemas_1 = require("@hellocacbantre/db-schemas");
const mongo_db_1 = require("../connections/mongo.db");
_a = (0, db_schemas_1.createConnect)(mongo_db_1.platformDb), exports.getModel = _a.getModel, exports.getConnection = _a.getConnection;
