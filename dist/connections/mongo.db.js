"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStoreDb = void 0;
const db_schemas_1 = require("@hellocacbantre/db-schemas");
const getStoreDb = (context) => {
    const { mongoDb } = context;
    return (0, db_schemas_1.createConnect)(mongoDb.instance);
};
exports.getStoreDb = getStoreDb;
