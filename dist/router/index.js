"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const Router = require("koa-router");
const userController_1 = require("../controller/userController");
const todoController_1 = require("../controller/todoController");
exports.router = new Router();
const User = new userController_1.UserController();
const Todo = new todoController_1.TodoController();
// Users routs
exports.router.get('/api/user', async (ctx) => {
    await User.getUser(ctx);
});
exports.router.post('/api/user', async (ctx) => {
    await User.createUser(ctx);
});
exports.router.post('/api/auth/login', async (ctx) => {
    await User.login(ctx);
});
exports.router.post('/api/auth/refresh_tokens', async (ctx) => {
    await User.refreshTokens(ctx);
});
// Todo routs
exports.router.get('/api/todo', async (ctx) => {
    await Todo.getItems(ctx);
});
exports.router.get('/api/todo/id', async (ctx) => {
    await Todo.getItemById(ctx);
});
exports.router.post('/api/todo', async (ctx) => {
    await Todo.addItem(ctx);
});
exports.router.patch('/api/todo/title', async (ctx) => {
    await Todo.editItem(ctx);
});
exports.router.patch('/api/todo/check', async (ctx) => {
    await Todo.setCheck(ctx);
});
exports.router.delete('/api/todo', async (ctx) => {
    await Todo.deleteItem(ctx);
});
exports.default = exports.router;
//     // Todo paths
//     if (pathname === '/api/todo' && req.method === 'GET') {
//       Todo.getItems(req, res);
//     } else if (pathname === '/api/todo/id' && req.method === 'GET') {
//       Todo.getItemById(req, res);
//     } else if (pathname === '/api/todo' && req.method === 'POST') {
//       Todo.addItem(req, res);
//     } else if (pathname === '/api/todo/title' && req.method === 'PATCH') {
//       Todo.editItem(req, res);
//     } else if (pathname === '/api/todo/check' && req.method === 'PATCH') {
//       Todo.setCheck(req, res);
//     } else if (pathname === '/api/todo' && req.method === 'DELETE') {
//       Todo.deleteItem(req, res);
//     }
//     return;
//   }
//   res.writeHead(405);
//   res.end(
//     JSON.stringify({ error: `${req.method} is not allowed for the request.` }),
//   );
// });
//# sourceMappingURL=index.js.map