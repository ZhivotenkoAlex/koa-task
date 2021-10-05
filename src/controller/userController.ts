import { UserModel } from '../model/userModel';
import * as types from '../types/types';
import { Context } from 'koa';

export class UserController {
  User: types.IUserModel;

  constructor() {
    this.User = new UserModel();
  }

  async getUser(ctx:Context): Promise<Error | void> {
    try {
      const item = ctx.request.query.item
      const user = await this.User.findUser(item);

      if (Object.keys(user).length === 0) {
        ctx.status=404
        ctx.body={ message: 'User not found' }
      } else {
        ctx.status=200
        ctx.body=user
      }
    } catch (error: unknown) {
      ctx.status=500
      ctx.body={message:error}        
    }
  }

  async createUser(ctx:Context): Promise<void | Error> {
    try {
      const { email, password }: types.IUserBody = ctx.request.body;
      const user: types.IUser | Error | undefined = await this.User.addUser(
          email,
          password,
        );             
      if (user instanceof Error) {
          ctx.status=422
          ctx.body={ error: user.message }
      }

      ctx.status=201
      ctx.body={ message: `User with email ${email} was added` }
    } catch (error:unknown) {
      ctx.status=500
      ctx.body={ message: 'User was not created' }
    }
  }

 async login(ctx:Context): Promise<void | Error> {
    try {
      const { email, password }: types.IUserBody = ctx.request.body;
      const tokens = await this.User.login(email, password);
        if (tokens instanceof Error) {
          ctx.status=401
          ctx.body={ error: tokens.message }
        } 
        ctx.status=200
        ctx.body=tokens

    } catch (error:unknown) {
      ctx.status=401
      ctx.body={ message: 'Wrong credentials' }
      
    }
  }

  async refreshTokens(ctx:Context): Promise<void | Error | types.IRefreshedTokens> {
    try {
        const token: string = ctx.request.body.refreshToken;
        const tokens = await this.User.refreshTokens(token);
        if (tokens instanceof Error) {
          ctx.status=404
          ctx.body={ error: tokens.message }
        }
        ctx.status=200
        ctx.body=tokens
    } catch (error: unknown) {
      ctx.status=500
      ctx.body={ error: error }  
    }
  }
}
