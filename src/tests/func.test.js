import { createMockContext } from "@shopify/jest-koa-mocks";
import {UserController} from '../controller/userController';
import { fail } from 'assert';
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
       expect(ctx.response.body).toEqual({
        "message": "User with email user5@gmail.com was added"    
        });
 
    });
    
    test('testing createUser with wrong email', async ()=>{
        const ctx=createMockContext({
            method:'POST',
            url: 'http://localhost:8080/api/user',
            requestBody:{
                email:"user5@",
                password:"123456"
            }
        })

        try {
         await User.createUser(ctx)
       
            // fail()
        } catch (error) {
            console.log(error);
            expect(error.code).toBe('ERR_ASSERTION');
        }
 
    });

    test('testing createUser with wrong password', async ()=>{
        const ctx=createMockContext({
            method:'POST',
            url: 'http://localhost:8080/api/user',
            requestBody:{
                email:"user5@gmail.com",
                password:"123"
            }
        })

        try {
            await User.createUser(ctx)
            fail()
        } catch (error) {
            expect(error.code).toBe('ERR_ASSERTION');
        }
 
    });

    test('testing createUser without body', async ()=>{
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

    test('testing login with wrong cred', async ()=>{
        const mockNext = jest.fn(() => Promise.resolve());
        const ctx=createMockContext({
            method:'POST',
            url: 'http://localhost:8080/api/auth/login',
            requestBody:{
                email:"user256",
                password:"123"
            }
        })
        try {
            await User.login(ctx,mockNext)
            fail()
        } catch (error) {
            expect(error.code).toBe('ERR_ASSERTION')
        }

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

    test('testing refreshToken with wrong body', async ()=>{
        const ctx=createMockContext({
            method:'POST',
            url: 'http://localhost:8080/api/auth/refresh_tokens',
            requestBody:{
                accessToken:"5151212121sdd",
                refreshToken:"jnjcdnn5555"
            }
        })
        try {
            await User.refreshTokens(ctx)
            fail()
        } catch (error) {
            expect(error.code).toBe('ERR_ASSERTION')
        }
    })

    test('testing refreshToken without body', async ()=>{
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

    test('testing get user by wrong id', async ()=>{
        const ctx=createMockContext({
                    url: 'http://localhost:8080/api/user?item=aaa',                
        })
      await User.getUser(ctx)       
      expect(ctx.response.status).toBe(404)
    })

    test('testing get user by email', async ()=>{
        const ctx=createMockContext({
                    url: 'http://localhost:8080/api/user?item=user3@gmail.com',              
        })
      await User.getUser(ctx)
      expect(ctx.response.status).toBe(200)
    })

    test('testing get user by wrong email', async ()=>{
        const ctx=createMockContext({
                    url: 'http://localhost:8080/api/user?item=user3@gmail',              
        })
      await User.getUser(ctx)
      expect(ctx.response.status).toBe(404)
    })

    test('testing get user by email with wrong url', async ()=>{
        const ctx=createMockContext({
                    url: 'http://localhost:8080/ap',              
        })
        await User.getUser(ctx)
        expect(ctx.response.status).toBe(500)
    })

})

//tests for Items

describe('unit testing of items controller',() => {
    test('testing addItem', async ()=>{
        const ctx=createMockContext({           
                method:'POST',
                url: 'http://localhost:8080/api/todos',
                requestBody:{
                    title:"test",
                    token:`Bearer ${accessToken}`
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