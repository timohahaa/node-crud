import express, { Express, Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import { UserService } from '../services/user.service';
import { DataSource } from 'typeorm';
import { User } from '../entity/user';
import authMiddleware from '../middleware/auth';

export function addUserRoutes(app: Express, db: DataSource) {
    const r: Router = express.Router();
    const userService: UserService = new UserService(db.getRepository(User));

    //  при создании пользователя возвращаем ему jwt-токен для дальнейшей авторизации
    r.post('/create', async (req: Request, resp: Response) => {
        if (req.method != "POST") {
            resp.status(405).send();
            return;
        }
        // картинка приходит как base64 строка
        if (req.body.firstName === null || req.body.firstName === undefined) {
            resp.status(400).send("fisrstName is required");
            return;
        }
        if (req.body.lastName === null || req.body.lastName === undefined) {
            resp.status(400).send("lastName is required");
            return;
        }
        if (req.body.password === null || req.body.password === undefined) {
            resp.status(400).send("password is required");
            return;
        }
        if (req.body.email === null || req.body.email === undefined) {
            resp.status(400).send("email is required");
            return;
        }
        if (req.body.imageData === null || req.body.imageData === undefined) {
            resp.status(400).send("imageData is required");
            return;
        }

        const firstName: string = String(req.body.firstName);
        const lastName: string = String(req.body.lastName);
        const password: string = String(req.body.password);
        const email: string = String(req.body.email);
        const imageData: string = String(req.body.imageData);

        const imageBuffer = Buffer.from(imageData, 'base64');

        try {
            const userId: number = await userService.createUser(firstName, lastName, password, email, imageBuffer);
            const payload = { userId: userId };
            const token: string = jwt.sign(payload, process.env.JWT_SECRET!);
            resp.status(201).json({ token: token });
        } catch (error: any) {
            resp.status(409).json({ error: `${error.message}` });
            return;
        }
    })

    // для последующих методов нужна авторизация
    r.use(authMiddleware);
    r.get('/read', async (req: Request, resp: Response) => {
        if (req.method != "GET") {
            resp.status(405).send();
            return;
        }

        if (req.body.email === null || req.body.email === undefined) {
            resp.status(400).send("email is required");
            return;
        }

        const email: string = String(req.body.email);
        try {
            const user: User = await userService.readUser(email);
            resp.status(200).json(user.toJson());
        } catch (error: any) {
            resp.status(404).json({ error: `${error.message}` });
        }
    })

    r.put('/update', async (req: Request, resp: Response) => {
        if (req.method != "PUT") {
            resp.status(405).send();
            return;
        }
        // картинка приходит как base64 строка
        if (req.body.email === null || req.body.email === undefined) {
            resp.status(400).send("email is required");
            return;
        }

        // достаточно проверить только email, остальное проверяется внутри userService
        const email: string = String(req.body.email);
        const imageBuffer: Buffer | undefined = (req.body.imageData === undefined) ? (undefined) : (Buffer.from(req.body.imageData, 'base64'));
        try {
            const userId: number = await userService.updateUser(email, req.body.firstName, req.body.lastName, req.body.password, imageBuffer);
            resp.status(202).json({ userId: userId });
        } catch (error: any) {
            resp.status(409).json({ error: `${error.message}` });
            return;
        }
    })

    r.delete('/delete', async (req: Request, resp: Response) => {
        if (req.method != "DELETE") {
            resp.status(405).send();
            return;
        }
        if (req.body.email === null || req.body.email === undefined) {
            resp.status(400).send("email is required");
            return;
        }

        const email: string = String(req.body.email);
        await userService.deleteUser(email);

        resp.status(200).send()
    })

    r.post('/pdf', async (req: Request, resp: Response) => {
        if (req.method != "POST") {
            resp.status(405).send();
            return;
        }
        if (req.body.email === null || req.body.email === undefined) {
            resp.status(400).send("email is required");
            return;
        }

        const email: string = String(req.body.email);
        try {
            const exists: boolean = await userService.createPdf(email);
            resp.status(200).json({ exists: exists });
        } catch (error: any) {
            resp.status(409).json({ error: `${error.message}` });
            return;
        }
    })

    r.get('/pdf', async (req: Request, resp: Response) => {
        if (req.method != "GET") {
            resp.status(405).send();
            return;
        }
        if (req.body.email === null || req.body.email === undefined) {
            resp.status(400).send("email is required");
            return;
        }

        const email: string = String(req.body.email);
        try {
            const pdfData: Buffer = await userService.getPdf(email);
            resp.set({
                "Content-Type": "application/pdf",
                "Content-Disposition": "attachment; filename=user.pdf"
            })
            resp.status(200).send(pdfData);
        } catch (error: any) {
            resp.status(409).json({ error: `${error.message}` });
            return;
        }
    })

    app.use('/user', r);
}
