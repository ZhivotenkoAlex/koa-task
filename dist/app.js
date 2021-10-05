"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Koa = require("koa");
const cors = require('@koa/cors');
const koaBody = require("koa-body");
const router_1 = require("./router");
const app = new Koa();
app.use(cors());
app.use(koaBody());
app.use(router_1.default.routes());
app.use(router_1.default.allowedMethods());
const port = 8000;
app.listen(port, () => {
    console.log('The server started on port 8000');
});
//# sourceMappingURL=app.js.map