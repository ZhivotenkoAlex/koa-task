import {TodoController} from '../controller/todoController';
const Todos = new TodoController()  



// jest.mock('../controller/todoController')
jest.mock('../model/todoModel')

describe('Unit testing todo controllers', ()=>{

  test('testing addItem', async ()=>{
    const ctx={
      response:{set:jest.fn()},
      request:{query:{
        Authorization:"token"
      }}
    }
    await expect (Todos.addItem(ctx)).resolves.toBeUndefined()
    expect(ctx).toMatchSnapshot()
    expect(ctx.response.set.mock.calls).toMatchSnapshot()
    expect(ctx.request.query.Authorization).toBe('token')
  })

  // test('testing get by id', async () => {
  //   const ctx={
  //     response:{}
  //   }
  //   expect (ctx.)
  // })

})

// describe('Unit testing todo controllers', ()=>{

//   test('testing deleteItem', async ()=>{
//     const ctx={
//       response:{set:jest.fn()}
//     }
//    await expect (Todos.deleteItem).resolves.toBeUndefined()
//     expect(ctx).toMatchSnapshot()
//     expect(ctx.response.set.mock.calls).toMatchSnapshot() 
//   })

// })





