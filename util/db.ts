import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../entity/user';
import { setTimeout } from 'timers/promises';

const attemps: number = parseInt(process.env.DB_MAX_CONN_ATTEMPTS!);
const timeout: number = parseInt(process.env.DB_CONN_TIMEOUT_SECONDS!);

const DB: DataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT!),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [User],
    synchronize: false,
})


export async function NewPostgresDB(): Promise<DataSource> {
    // пробуем подключиться к базе заданное количество попыток
    console.log("trying to connect to Postgres...");
    for (let i = 0; i < attemps!; i++) {
        console.log(`attemp: ${i + 1}`);
        await DB.initialize();
        if (DB.isInitialized) {
            break;
        }
        await new Promise((r) => setTimeout(timeout * 1000, r));
    }
    if (DB.isInitialized) {
        console.log("successfuly connected to Postgres");
        return DB;
    }
    // не подключились к базе - ошибка
    throw new Error("connection to Postgres could not be established");
}
