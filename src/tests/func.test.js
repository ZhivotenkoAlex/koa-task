import { createMockContext } from "@shopify/jest-koa-mocks";
import {UserController} from '../controller/userController';
const User = new UserController() 

import {TodoController} from '../controller/todoController';
const Todos = new TodoController() 

// jest.mock('../model/userModel')
let accessToken=null
let refreshToken=null

describe('unit testing of user`s controller',()=>{
    test('testing createUser', async ()=>{
        const ctx=createMockContext({
            requestBody:{
                method:'POST',
                url: 'http://localhost:8080/api/user',
                email:"user5@gmail.com",
                password:"123456"
            }
        })
       const result = await User.createUser(ctx)
       expect(ctx.response.status).toBe(201)
    });
    test('testing createUser without cred', async ()=>{
        const ctx=createMockContext({
            method:'POST',
            url: 'http://localhost:8080/api/user',
               })
  
       await User.createUser(ctx)
       expect(ctx.response.status).toBe(500)
    });
    test('testing login', async ()=>{
        const ctx=createMockContext({
            method:'POST',
            url: 'http://localhost:8080/api/auth/login',
            requestBody:{
                email:"user256@gmail.com",
                password:"123456"
            }
        })
      await User.login(ctx)
       
       accessToken = ctx.response.body.accessToken
       refreshToken = ctx.response.body.refreshToken
       expect(ctx.response.status).toBe(200)
    });
    test('testing login without cred', async ()=>{
        const ctx=createMockContext({
            method:'POST',
            url: 'http://localhost:8080/api/auth/login',
             })
      await User.login(ctx)
      expect(ctx.response.status).toBe(401)
    });
    test('testing refreshToken', async ()=>{
        const ctx=createMockContext({
            method:'POST',
            url: 'http://localhost:8080/api/auth/refresh_tokens',
            requestBody:{
                accessToken,
                refreshToken
            }
        })
      await User.refreshTokens(ctx)
      expect(ctx.response.status).toBe(200)
    })
    test('testing refreshToken with error', async ()=>{
        const ctx=createMockContext({
            method:'POST',
            url: 'http://localhost:8080/api/auth/refresh_tokens',
        })
      await User.refreshTokens(ctx)
      expect(ctx.response.status).toBe(500)
    })
    test('testing get user by id', async ()=>{
        const ctx=createMockContext({
                    url: 'http://localhost:8080/api/user?item=38',                
        })
      await User.getUser(ctx)
      expect(ctx.response.status).toBe(200)
    })
    test('testing get user by email', async ()=>{
        const ctx=createMockContext({
                    url: 'http://localhost:8080/api/user?item=user3@gmail.com',                
        })
      await User.getUser(ctx)
      expect(ctx.response.status).toBe(200)
    })

})

describe('unit testing of items controller',() => {
    test('testing addItem', async ()=>{
        const ctx=createMockContext({
            requestBody:{
                method:'POST',
                url: 'http://localhost:8080/api/todos',
                requestBody:{
                    title:"test",
                    token:`Bearer ${accessToken}`
                }
            }
        })
       await Todos.addItem(ctx)
       expect(ctx.response.status).toBe(201)
    });

    test('testing addItem without body', async ()=>{
        const ctx=createMockContext({       
                method:'POST',
                url: 'http://localhost:8080/api/todos',                    
        })
       await Todos.addItem(ctx)
       expect(ctx.response.status).toBe(404)
    });

    test('testing editTitle', async ()=>{
        const ctx=createMockContext({
            method:"PATCH",
            url: 'http://localhost:8080/api/todos/title',
            requestBody:{
                title:'test',
                id:134,
                token: `Bearer ${accessToken}`
            }
        })
       await Todos.editItem(ctx)
       expect(ctx.response.status).toBe(200)
    });

    test('testing editTitle without body', async ()=>{
        const ctx=createMockContext({
            method:"PATCH",
            url: 'http://localhost:8080/api/todos/title',
            })
       await Todos.editItem(ctx)
       expect(ctx.response.status).toBe(404)
    });

    test('testing check item', async ()=>{
        const ctx=createMockContext({
            method:'PATCH',
            url: 'http://localhost:8080/api/todos/check',
            requestBody:{
                checked:true,
                id:134,
                token: `Bearer ${accessToken}`
            }
        })
       await Todos.setCheck(ctx)
       expect(ctx.response.status).toBe(200)
    });


    test('testing check item without body', async ()=>{
        const ctx=createMockContext({
            method:'PATCH',
            url: 'http://localhost:8080/api/todos/check',
           
        })
       await Todos.setCheck(ctx)
       expect(ctx.response.status).toBe(404)
    });

    test('testing delete item', async ()=>{
        const ctx=createMockContext({
            method:"DELETE",
            url: `http://localhost:8080/api/todos/title?id=134&Authorization=Bearer ${accessToken}`,
        })
       await Todos.deleteItem(ctx)
       expect(ctx.response.status).toBe(200)
    });

   })