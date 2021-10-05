import * as Router from "koa-router";

import { Context, DefaultState } from "koa";
import { UserController } from '../controller/userController';
import { TodoController } from '../controller/todoController';
import { appendFile } from "fs";

export const router = new Router();
const User = new UserController();
const Todo = new TodoController();

// Users routs

router.get('/api/user', async(ctx)=>{    
   await User.getUser(ctx)
})
router.post('/api/user', async(ctx)=>{
    await User.createUser(ctx)
})
router.post('/api/auth/login', async(ctx)=>{
    await User.login(ctx)
})
router.post('/api/auth/refresh_tokens', async(ctx)=>{
    await User.refreshTokens(ctx)
})

// Todo routs

router.get('/api/todos', async(ctx)=>{    
    await Todo.getItems(ctx)
 })

router.get('/api/todos/:id', async(ctx)=>{ 
   await Todo.getItemById(ctx)
 })

router.post('/api/todos', async(ctx)=>{
    await Todo.addItem(ctx)
})

router.patch('/api/todos/title', async(ctx)=>{
    await Todo.editItem(ctx)
})

router.patch('/api/todos/check', async(ctx)=>{
    await Todo.setCheck(ctx)
})

router.delete('/api/todos', async(ctx)=>{
 await Todo.deleteItem(ctx)
})

export default router

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
