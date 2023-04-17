"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const simple_1 = require("../simple");
const app = (0, express_1.default)();
const authRole = new simple_1.AuthRole();
const handlerError = (err, _, res, __) => {
    var _a;
    return res.json({
        status: (_a = err.status) !== null && _a !== void 0 ? _a : 500,
        message: err.message
    });
};
app.get('/', authRole.isUser, (req, res) => {
    res.send('Xin chào, đây là trang chủ!');
});
app.use(handlerError);
app.listen(3000, () => {
    console.log('Server đang chạy trên cổng 3000...');
});
// ts-node-esm src/tests/index.ts
