"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = require("crypto");
class Helper {
    static generateOTP() {
        return Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    }
    static generateRandomString(length = 8) {
        return (0, crypto_1.randomBytes)(length).toString('hex');
    }
    static hashData(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
            return yield bcrypt_1.default.hash(data, saltRounds);
        });
    }
    static compareHashedData(data, hashed) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcrypt_1.default.compare(data, hashed);
        });
    }
}
