import { TodoModel } from '../model/todoModel';  
import { VerifyAccess } from '../helpers/verifyAccess';
import * as types from '../types/types';
import { Context } from 'koa';

export class TodoController {
  Todo: types.ITodoModel;

  Verify: types.IVerifyAccess;

  constructor() {
    this.Todo = new TodoModel();
    this.Verify = new VerifyAccess();
  }

  async getItemById(ctx:Context): Promise<string | void> {
    const { id, Authorization } = ctx.request.query
    const token = (<string>Authorization).split(' ')[1];
    try {
      const result = await this.Verify.verify(token);
      if (result instanceof Error) {
        ctx.status=401
        ctx.body={ error: result.message }
      }
      const item = await this.Todo.getItemById(<string>id);
      ctx.status=200
      ctx.body=item
    } catch (err) {
      ctx.status=404
      ctx.body=`There are no item with id=${id}`
     }
  }

  async getItems(ctx:Context): Promise<Array<types.ITodoItem> | void> {
    try {
      const { Authorization } = ctx.request.query
      console.log('Authorization');
      console.log(Authorization);
         
      const accessToken = (<string>Authorization).split(' ')[1];
 
      const result = await this.Verify.verify(accessToken);
 
      if (result instanceof Error) {
        ctx.status=401
        ctx.body={ error: result.message }
      }
      if (result) {
        const items = await this.Todo.getItems(accessToken);       
        
        if (items instanceof Error) {
          ctx.status=404
          ctx.body={ error: items.message }
        }
       ctx.status=200
       ctx.body=items
      }else
      {
        ctx.status=404
        ctx.body={ message: 'Item does not exist' }
      }

 
     } catch (error) {
       ctx.status=200
       ctx.body={ message: error }
    }
  }

  async addItem(ctx:Context):Promise<void> {
    try {
        const { title, token }: types.ITodoBody = ctx.request.body

        const result = await this.Verify.verify(token.split(' ')[1]);
        if (result instanceof Error) {
          ctx.status=401
          ctx.body={ error: result.message }
        }
        await this.Todo.createItem(title, token);
        ctx.status=201
        ctx.body={ message: `Item ${title} was added` }
    } catch (error) {
      ctx.status=404
      ctx.body={ message: 'Item was not created' }
    }
  }

  async editItem(ctx:Context):Promise<void> {
    try {
        const { title, id, token }: types.ITodoBody = ctx.request.body
        const result = await this.Verify.verify(token.split(' ')[1]);
        if (result instanceof Error) {
          ctx.status=401
          ctx.body={ error: result.message }
        }
        const responseDb = await this.Todo.editElement(title, id);
        if (responseDb instanceof Error) {
          ctx.status=404
          ctx.body={ message: 'Item does not exist' }
       }
       ctx.status=200
       ctx.body= { message: `Item ${id} was changed` }
    } catch (error) {
      ctx.status=404
      ctx.body={ message: 'Item was not changed' }
    }
  }

  async setCheck(ctx:Context):Promise<void> {
    try {
        const { checked, id, token }: types.ITodoBody = ctx.request.body
        const result = await this.Verify.verify( token.split(' ')[1]);
        if (result instanceof Error) {
          ctx.status=401
          ctx.body={ error: result.message }
        }
        const responseDb = await this.Todo.setCheck(checked, id);
        if (responseDb instanceof Error) {
          ctx.status=404
          ctx.body={ message: 'Item does not exist' }
         }
         ctx.status=200
         ctx.body={ message: `Item ${id} was changed` }
    } catch (error) {
      ctx.status=404
      ctx.body={ message: 'Item was not changed' }
    }
  }

  async deleteItem(ctx:Context):Promise<void> {
    try {
        const { id, token }: types.ITodoBody = ctx.request.query
        const result = await this.Verify.verify(token.split(' ')[1]);
        if (result instanceof Error) {
          ctx.status=401
          ctx.body={ error: result.message }
        }

        const responseDb = await this.Todo.deleteElement(id);
        if (responseDb instanceof Error) {
          ctx.status=404
          ctx.body={ message: 'Item does not exist' }
        }
        ctx.status=200
        ctx.body={ message: `Item ${id} was deleted` }
    } catch (error) {
      ctx.status=404
      ctx.body={ message: 'Item was not deleted ' }
    }
  }
}
