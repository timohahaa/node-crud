"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const user_routes_1 = require("./routes/user.routes");
const app = (0, express_1.default)();
const port = process.env.SERVER_PORT;
// подключаемся к бд
const db_1 = __importDefault(require("./util/db"));
app.get('/', (req, res) => {
    res.status(200).send("Healthcheck!");
});
(0, user_routes_1.addUserRoutes)(app, db_1.default);
app.listen(port, () => {
    console.log(`Started server at http://localhost:${port}`);
});
