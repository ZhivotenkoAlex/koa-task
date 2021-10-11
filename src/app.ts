import Koa from 'koa';
const cors = require('@koa/cors')
import koaBody from 'koa-body';
import routerApi from './router'
import { VerifyAccess } from './helpers/verifyAccess';
const Verify = new VerifyAccess()
    
const app = new Koa()
app.use(cors())
app.use(koaBody())

// Middleware for token verification 
app.use(async (ctx, next) => {
  try { 
    const Authorization = ctx.request.query.Authorization||ctx.request.body.token
    console.log(ctx.request.url);
    
    let result
    if(ctx.request.url === '/api/user'||ctx.request.url ==='/api/auth/login'||ctx.request.url ==='/api/auth/refresh_tokens'){
     await next();
    }else if(Authorization){
      const token=(<string><unknown>Authorization).split(' ')[1]
      result = await Verify.verify(token)     
    }

     if(result){
      await next();
    }else{      
      ctx.status = 401
      ctx.body = { 'message':"invalid token" }
    }
   } catch (error) {
    ctx.status = 401
    ctx.body = { 'message':error.message }
  } 
});

app.use(routerApi.routes())
app.use(routerApi.allowedMethods())

const port = 8000;


const server = app.listen(port, () => {
    console.log('The server started on port 8000');
  });

  module.exports = app


