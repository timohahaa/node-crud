import express, { Express, Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { DataSource } from 'typeorm';

export function addUserRoutes(app: Express, db: DataSource) {
    const r = express.Router();
    const userService = new UserService(db);

    r.get('/create', async (req: Request, resp: Response) => {
        resp.send("works!");
    })




    app.use('/user', r);
}
