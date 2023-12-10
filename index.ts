import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

import { addUserRoutes } from './routes/user.routes';
import { NewPostgresDB } from './util/db';
import { DataSource } from 'typeorm';

const app: Express = express();
const port = process.env.SERVER_PORT;

async function startServer() {
    let db: DataSource;
    try {
        // подключаемся к бд
        db = await NewPostgresDB();
    } catch (error) {
        console.log(`wasn't abble co connect to postgress, exiting...`);
        process.exit(1);
    }

    app.get('/', (req: Request, res: Response) => {
        res.status(200).send("Healthcheck!");
    });

    addUserRoutes(app, db);

    app.listen(port, () => {
        console.log(`Started server at http://localhost:${port}`);
    })
}

startServer();

