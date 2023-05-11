"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJwtSetting = void 0;
const redisio_db_1 = require("../connections/redisio.db");
const getJwtSetting = (context) => {
    const falcol = (0, redisio_db_1.getFalcol)(context);
    return (key) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        return (_a = (yield falcol.get(`global_setting:${key}`))) !== null && _a !== void 0 ? _a : '';
    });
};
exports.getJwtSetting = getJwtSetting;
