import * as Koa from 'koa'
const cors = require('@koa/cors')
import * as koaBody from 'koa-body'
import routerApi from './router'

const app = new Koa()
app.use(cors())
app.use(koaBody())

app.use(routerApi.routes())
app.use(routerApi.allowedMethods())

const port = 8000;

app.listen(port, () => {
    console.log('The server started on port 8000');
  });




