"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStoreDb = void 0;
const db_schemas_1 = require("@hellocacbantre/db-schemas");
const getStoreDb = (context) => {
    const { mongoDb } = context;
    const db = (0, db_schemas_1.newConnection)(mongoDb.uri, mongoDb.options);
    return (0, db_schemas_1.createConnect)(db);
};
exports.getStoreDb = getStoreDb;
