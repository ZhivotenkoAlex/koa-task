"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const cors = require('@koa/cors');
const koa_body_1 = __importDefault(require("koa-body"));
const router_1 = __importDefault(require("./router"));
const verifyAccess_1 = require("./helpers/verifyAccess");
const Verify = new verifyAccess_1.VerifyAccess();
const app = new koa_1.default();
app.use(cors());
app.use((0, koa_body_1.default)());
// Middleware for token verification 
app.use(async (ctx, next) => {
    try {
        const Authorization = ctx.request.query.Authorization || ctx.request.body.token;
        let result;
        if (ctx.request.url === '/api/user' || ctx.request.url === '/api/auth/login' || ctx.request.url === '/api/auth/refresh_tokens') {
            await next();
        }
        else if (Authorization) {
            const token = Authorization.split(' ')[1];
            result = await Verify.verify(token);
        }
        if (result) {
            await next();
        }
        else {
            ctx.status = 401;
            ctx.body = { 'message': "invalid token" };
        }
    }
    catch (error) {
        ctx.status = 401;
        ctx.body = { 'message': error.message };
    }
});
app.use(router_1.default.routes());
app.use(router_1.default.allowedMethods());
const port = 8000;
const server = app.listen(port, () => {
    console.log('The server started on port 8000');
});
module.exports = app;
//# sourceMappingURL=app.js.map