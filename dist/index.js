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
const body_parser_1 = require("body-parser");
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
require("reflect-metadata");
const data_source_1 = require("./data-source");
const auth_1 = __importDefault(require("./routes/auth"));
const organisation_1 = __importDefault(require("./routes/organisation"));
dotenv_1.default.config();
const API_KEY = process.env.HNG_API_KEY;
const PORT = process.env.PORT || 8000;
const app = (0, express_1.default)();
app.use((0, body_parser_1.json)());
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(404).json({ data: 'Home api is working' });
}));
data_source_1.AppDataSource.initialize()
    .then(() => {
    console.log('Connected to the database');
    app.use('/auth', auth_1.default);
    app.use('/api/organisations', organisation_1.default);
    app.listen(PORT, () => {
        console.log(`Server started on http://localhost:${PORT}`);
    });
})
    .catch((error) => console.log(error));
