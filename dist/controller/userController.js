"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const userModel_1 = require("../model/userModel");
class UserController {
    constructor() {
        this.User = new userModel_1.UserModel();
    }
    async getUser(ctx) {
        try {
            const item = ctx.request.query.item;
            const user = await this.User.findUser(item);
            if (Object.keys(user).length === 0) {
                ctx.status = 404;
                ctx.body = { message: 'User not found' };
            }
            else {
                ctx.status = 200;
                ctx.body = user;
            }
        }
        catch (error) {
            ctx.status = 500;
            ctx.body = { message: error };
        }
    }
    async createUser(ctx) {
        try {
            const { email, password } = ctx.request.body;
            const user = await this.User.addUser(email, password);
            if (user instanceof Error) {
                ctx.status = 422;
                ctx.body = { error: user.message };
            }
            ctx.status = 201;
            ctx.body = { message: `User with email ${email} was added` };
        }
        catch (error) {
            ctx.status = 500;
            ctx.body = { message: 'User was not created' };
        }
    }
    async login(ctx) {
        try {
            const { email, password } = ctx.request.body;
            const tokens = await this.User.login(email, password);
            if (tokens instanceof Error) {
                ctx.status = 401;
                ctx.body = { error: tokens.message };
            }
            ctx.status = 200;
            ctx.body = tokens;
        }
        catch (error) {
            ctx.status = 401;
            ctx.body = { message: 'Wrong credentials' };
        }
    }
    async refreshTokens(ctx) {
        try {
            const token = ctx.request.body.refreshToken;
            const tokens = await this.User.refreshTokens(token);
            if (tokens instanceof Error) {
                ctx.status = 404;
                ctx.body = { error: tokens.message };
            }
            ctx.status = 200;
            ctx.body = tokens;
        }
        catch (error) {
            ctx.status = 500;
            ctx.body = { error: error };
        }
    }
}
exports.UserController = UserController;
//# sourceMappingURL=userController.js.map