import { Response, Request, NextFunction } from "express";
import jwt from 'jsonwebtoken';

export default async function authMiddleware(req: Request, resp: Response, next: NextFunction) {
    let token: string | undefined = req.header("Authorization");
    if (token === undefined) {
        resp.status(401).send("Access Denied");
        return;
    }
    if (token.startsWith("Bearer ")) {
        token = token.slice(7, token.length).trimStart();
    }
    try {
        jwt.verify(token, process.env.JWT_SECRET!);
        next();
    } catch (error) {
        resp.status(400).send("invalid auth token");
    }
}
