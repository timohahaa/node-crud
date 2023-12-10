import express, { Express, Request, Response, Router } from 'express';
import { UserService } from '../services/user.service';
import { DataSource } from 'typeorm';
import { User } from '../entity/user';

export function addUserRoutes(app: Express, db: DataSource) {
    const r: Router = express.Router();
    const userService: UserService = new UserService(db.getRepository(User));

    r.get('/create', async (req: Request, resp: Response) => {
        resp.send("works!");
    })




    app.use('/user', r);
}
