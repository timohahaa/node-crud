import bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { User } from '../entity/user';


export class UserService {
    private db: DataSource

    public constructor(postgres: DataSource) {
        this.db = postgres;
    }

    // CRUD

    public async createUser(firslName: string, lastName: string, password: string, email: string, image: Buffer): Promise<number> {
        const userRepo = this.db.getRepository(User);
        // проверить что такого пользователя еще не существует
        const existingUser = await userRepo.findOneBy({ email: email });
        if (existingUser != null) {
            throw new Error(`user with email ${email} already exists!`);
        }
        // такого пользователя нет, создадим и сохраним его
        const newUser = new User();
        newUser.firstName = firslName;
        newUser.lastName = lastName;
        newUser.email = email;
        newUser.image = image;

        const hashedPassword: string = await bcrypt.hash(password, 10);
        newUser.password = hashedPassword;
        await userRepo.save(newUser);

        return newUser.id;
    }

    public async readUser(email: string): Promise<User> {
        const userRepo = this.db.getRepository(User);

        const user = await userRepo.findOneBy({ email: email });
        if (user != null) {
            return user;
        }

        // нет такого пользователя
        throw new Error(`user with email ${email} does not exist!`);
    }

    public async updateUser(email: string, firstName?: string, lastName?: string, password?: string, image?: Buffer): Promise<number> {
        const userRepo = this.db.getRepository(User);
        // проверить что такой пользователь существует
        const existingUser = await userRepo.findOneBy({ email: email });
        if (existingUser == null) {
            throw new Error(`user with email ${email} does not exist!`);
        }
        // заполняем данные по пользователю
        if (firstName != undefined) {
            existingUser.firstName = firstName;
        }
        if (lastName != undefined) {
            existingUser.lastName = lastName;
        }
        if (image != undefined) {
            existingUser.image = image;
        }
        if (password != undefined) {
            const hashedPassword: string = await bcrypt.hash(password, 10);
            existingUser.password = hashedPassword;
        }
        // сохраняем пользователя
        await userRepo.save(existingUser);

        return existingUser.id;
    }

    public async deleteUser(email: string) {
        const userRepo = this.db.getRepository(User);
        // можно не проверять, что пользователя не существует
        // если его не существует, в базе как раз ничего не удалится
        await userRepo.delete({ email: email });

    }
}


