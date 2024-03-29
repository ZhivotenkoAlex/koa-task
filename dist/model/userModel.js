"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
// import * as dotenv from 'dotenv';
// dotenv.config({ path: __dirname + './env' });
const pool_1 = require("../db/pool");
const jwt = __importStar(require("jsonwebtoken"));
const randomString = __importStar(require("randomstring"));
class UserModel {
    constructor() {
        // this.SECRET = process.env.SECRET;
        // this.REFRESH_TOKEN_LIFE_TIME = process.env.REFRESH_TOKEN_LIFE_TIME;
        this.SECRET = "trololo",
            this.REFRESH_TOKEN_LIFE_TIME = "72000000";
    }
    async findUser(query) {
        try {
            const conn = await pool_1.pool.getConnection();
            const sql = 'SELECT * FROM nodeDB.users WHERE userId=? OR email=? OR token=?';
            const [row] = await conn.query(sql, [
                query,
                query,
                query,
            ]);
            conn.release();
            if (!row) {
                return new Error('User does not exist');
            }
            return row;
        }
        catch (error) {
            console.log(error);
        }
    }
    async validateEmail(email) {
        const reg = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        return reg.test(String(email).toLowerCase());
    }
    async addUser(email, password) {
        try {
            const user = await this.findUser(email);
            const lifeTime = Number(this.REFRESH_TOKEN_LIFE_TIME);
            const salt = await bcrypt_1.default.genSalt(Number(process.env.SALT_ROUNDS));
            const hashPassword = await bcrypt_1.default.hash(password, salt, null);
            if ((await this.validateEmail(email)) === false) {
                return new Error(`Email ${email} is invalid`);
            }
            else if (password.length < 6) {
                return new Error(`Password length must be at least 6 characters(you are currently using ${password.length} characters`);
            }
            else if (user instanceof Error &&
                user.message === 'User does not exist') {
                const conn = await pool_1.pool.getConnection();
                const user = [email, hashPassword, Date.now(), lifeTime];
                const sql = 'INSERT INTO users (email,password,date,expiresIn) VALUES (?,?,?,?)';
                await conn.query(sql, user);
                conn.release();
            }
            else {
                return new Error('User already exist');
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    async isValidPassword(email, password) {
        try {
            const user = await this.findUser(email);
            if (user instanceof Error) {
                return new Error('User does not exist');
            }
            const isValid = await bcrypt_1.default.compare(password, user.password);
            if (!isValid) {
                return new Error('Invalid credentials');
            }
            return user;
        }
        catch (error) {
            console.log(error);
        }
    }
    async generateAccessToken(user) {
        try {
            const payload = {
                type: 'access',
                id: user.userId,
                lifetime: Number(this.REFRESH_TOKEN_LIFE_TIME) + Date.now(),
            };
            const token = jwt.sign(payload, this.SECRET, {
                expiresIn: '10h',
            });
            return token;
        }
        catch (error) {
            console.log(error);
        }
    }
    async generateRefreshToken() {
        try {
            const salt = await bcrypt_1.default.genSalt(10);
            const token = await bcrypt_1.default.hash(randomString.generate(32), salt, null);
            return token;
        }
        catch (error) {
            console.log(error);
        }
    }
    async updateDbRefreshToken(refreshToken, user) {
        const conn = await pool_1.pool.getConnection();
        try {
            if (user instanceof Error) {
                return new Error('User does not exist');
            }
            const editInfo = [refreshToken, Date.now(), user.userId];
            const sql = 'UPDATE users SET token=?,date=? WHERE userId=?';
            await conn.query(sql, editInfo);
            conn.release();
        }
        catch (error) {
            console.log(error);
        }
    }
    async updateTokens(user) {
        if (user) {
            try {
                if (user instanceof Error) {
                    return new Error('User does not exist');
                }
                const accessToken = await this.generateAccessToken(user);
                const refreshToken = await this.generateRefreshToken();
                if (refreshToken) {
                    await this.updateDbRefreshToken(refreshToken, user);
                    return {
                        accessToken,
                        refreshToken,
                    };
                }
            }
            catch (error) {
                console.log(error);
            }
        }
    }
    async login(email, password) {
        try {
            const user = await this.isValidPassword(email, password);
            const isEmailValid = await this.validateEmail(email);
            if (user instanceof Error || isEmailValid === false) {
                return new Error('Wrong credentials');
            }
            const tokens = await this.updateTokens(user);
            return tokens;
        }
        catch (error) {
            console.log(error);
        }
    }
    async refreshTokens(refreshToken) {
        try {
            const user = await this.findUser(refreshToken);
            if (user instanceof Error) {
                new Error('Invalid Token');
            }
            return await this.updateTokens(user);
        }
        catch (error) {
            console.log(error);
        }
    }
}
exports.UserModel = UserModel;
//# sourceMappingURL=userModel.js.map