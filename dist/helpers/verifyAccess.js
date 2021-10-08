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
exports.VerifyAccess = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const userModel_1 = require("../model/userModel");
class VerifyAccess {
    constructor() {
        this.User = new userModel_1.UserModel();
        // this.SECRET = process.env.SECRET;
        this.SECRET = "trololo";
    }
    async verify(token) {
        try {
            const payload = jwt.verify(token, this.SECRET);
            const user = await this.User.findUser(payload.id);
            if (!payload) {
                return new Error('invalid token');
            }
            if (payload.type !== 'access') {
                return new Error('wrong token');
            }
            if (user instanceof Error) {
                return new Error('invalid token');
            }
            else if (user.date + user.expiresIn < Date.now()) {
                return new Error('token expired');
            }
            if (!user) {
                return new Error('invalid token');
            }
        }
        catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                return new Error('error token');
            }
        }
        return true;
    }
}
exports.VerifyAccess = VerifyAccess;
//# sourceMappingURL=verifyAccess.js.map