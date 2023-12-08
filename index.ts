import express, { Express, Request, Response } from 'express';


const app: Express = express();
// потом поменяю порт на конфиг
const port = 3000;

app.get('/', (req: Request, res: Response) => {
    res.status(200).send("Healthcheck!");
});

app.listen(port, () => {
    console.log(`Started server at http://localhost:${port}`);
})
