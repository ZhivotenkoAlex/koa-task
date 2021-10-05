"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoController = void 0;
const todoModel_1 = require("../model/todoModel");
class TodoController {
    constructor() {
        this.Todo = new todoModel_1.TodoModel();
    }
    async getItemById(ctx) {
        const id = ctx.params.id;
        try {
            const item = await this.Todo.getItemById(id);
            ctx.status = 200;
            ctx.body = item;
        }
        catch (err) {
            ctx.status = 404;
            ctx.body = `There are no item with id=${id}`;
        }
    }
    async getItems(ctx) {
        try {
            const { Authorization } = ctx.request.query;
            const accessToken = Authorization.split(' ')[1];
            const items = await this.Todo.getItems(accessToken);
            if (items instanceof Error) {
                ctx.status = 404;
                ctx.body = { error: items.message };
            }
            if (items.length > 0) {
                ctx.status = 200;
                ctx.body = items;
            }
            else {
                ctx.status = 404;
                ctx.body = { message: 'Item does not exist' };
            }
        }
        catch (error) {
            ctx.status = 200;
            ctx.body = { message: error };
        }
    }
    async addItem(ctx) {
        try {
            const { title, token } = ctx.request.body;
            await this.Todo.createItem(title, token);
            ctx.status = 201;
            ctx.body = { message: `Item ${title} was added` };
        }
        catch (error) {
            ctx.status = 404;
            ctx.body = { message: 'Item was not created' };
        }
    }
    async editItem(ctx) {
        try {
            const { title, id } = ctx.request.body;
            const responseDb = await this.Todo.editElement(title, id);
            if (responseDb instanceof Error) {
                ctx.status = 404;
                ctx.body = { message: 'Item does not exist' };
            }
            ctx.status = 200;
            ctx.body = { message: `Item ${id} was changed` };
        }
        catch (error) {
            ctx.status = 404;
            ctx.body = { message: 'Item was not changed' };
        }
    }
    async setCheck(ctx) {
        try {
            const { checked, id } = ctx.request.body;
            const responseDb = await this.Todo.setCheck(checked, id);
            if (responseDb instanceof Error) {
                ctx.status = 404;
                ctx.body = { message: 'Item does not exist' };
            }
            ctx.status = 200;
            ctx.body = { message: `Item ${id} was changed` };
        }
        catch (error) {
            ctx.status = 404;
            ctx.body = { message: 'Item was not changed' };
        }
    }
    async deleteItem(ctx) {
        try {
            const { id } = ctx.request.query;
            const responseDb = await this.Todo.deleteElement(id);
            if (responseDb instanceof Error) {
                ctx.status = 404;
                ctx.body = { message: 'Item does not exist' };
            }
            ctx.status = 200;
            ctx.body = { message: `Item ${id} was deleted` };
        }
        catch (error) {
            ctx.status = 404;
            ctx.body = { message: 'Item was not deleted ' };
        }
    }
}
exports.TodoController = TodoController;
//# sourceMappingURL=todoController.js.map