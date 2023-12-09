import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

import { addUserRoutes } from './routes/user.routes';
import { NewPostgresDB } from './util/db';
import { DataSource } from 'typeorm';

const app: Express = express();
const port = process.env.SERVER_PORT;

// подключаемся к бд
const db: DataSource = await NewPostgresDB();

app.get('/', (req: Request, res: Response) => {
    res.status(200).send("Healthcheck!");
});

addUserRoutes(app, db);

app.listen(port, () => {
    console.log(`Started server at http://localhost:${port}`);
})
