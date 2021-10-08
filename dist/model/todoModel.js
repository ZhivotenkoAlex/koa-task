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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoModel = void 0;
const pool_1 = require("../db/pool");
const jwt = __importStar(require("jsonwebtoken"));
const dotenv = __importStar(require("dotenv"));
dotenv.config({ path: __dirname + '/.env' });
class TodoModel {
    constructor() {
        // this.SECRET = process.env.SECRET;
        this.SECRET = "trololo";
    }
    async getItemById(id) {
        try {
            const conn = await pool_1.pool.getConnection();
            const sql = 'SELECT * FROM todo WHERE id=?';
            const dbResponseData = await conn.query(sql, [id]);
            conn.release();
            return dbResponseData;
        }
        catch (error) {
            console.log(error);
        }
    }
    async createItem(title, accessToken) {
        try {
            const conn = await pool_1.pool.getConnection();
            const payload = jwt.verify(accessToken.split(' ')[1], this.SECRET);
            if (payload instanceof Error) {
                return new Error('Invalid token');
            }
            const item = [title, payload.id];
            const sql = 'INSERT INTO todo (text,userId) VALUES (?,?)';
            await conn.query(sql, item);
            conn.release();
        }
        catch (error) {
            console.log(error);
        }
    }
    async getItems(accessToken) {
        try {
            const user = jwt.verify(accessToken, this.SECRET);
            const userId = user.id;
            if (user instanceof Error) {
                return new Error('Invalid token');
            }
            const conn = await pool_1.pool.getConnection();
            const sql = 'SELECT * FROM todo WHERE userId=?';
            const dbResponseData = await conn.query(sql, [
                userId,
            ]);
            const response = dbResponseData.map(item => {
                return item;
            });
            conn.release();
            return response;
        }
        catch (error) {
            console.log(error);
        }
    }
    async editElement(title, id) {
        try {
            const conn = await pool_1.pool.getConnection();
            const editInfo = [title, id];
            const sql = 'UPDATE todo SET text=? WHERE id=?';
            const dbResponse = await conn.query(sql, editInfo);
            if (dbResponse.affectedRows === 0) {
                return new Error('Wrong id');
            }
            conn.release();
        }
        catch (error) {
            console.log(error);
        }
    }
    async setCheck(checked, id) {
        try {
            const conn = await pool_1.pool.getConnection();
            const editInfo = [checked, id];
            const sql = 'UPDATE todo SET checked=? WHERE id=?';
            const dbResponse = await conn.query(sql, editInfo);
            if (dbResponse.affectedRows === 0) {
                return new Error('Wrong id');
            }
            conn.release();
        }
        catch (error) {
            console.log(error);
        }
    }
    async deleteElement(id) {
        try {
            const conn = await pool_1.pool.getConnection();
            const sql = 'DELETE FROM todo WHERE id=?';
            const dbResponse = await conn.query(sql, id);
            if (dbResponse.affectedRows === 0) {
                return new Error('Wrong id');
            }
            conn.release();
        }
        catch (error) {
            console.log(error);
        }
    }
}
exports.TodoModel = TodoModel;
//# sourceMappingURL=todoModel.js.map