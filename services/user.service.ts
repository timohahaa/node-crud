import bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '../entity/user';


// решил передавать в класс не DataSource, а конечный репозиторий, так как так будет легче рефакторить и поддерживать в дальнейшем
// + это more general, потом будет легче сменить ОРМ
export class UserService {
    //    private db: DataSource;
    private userRepo: Repository<User>;

    public constructor(userRepo: Repository<User>) {
        //        this.db = postgres;
        this.userRepo = userRepo;
    }

    // CRUD

    public async createUser(firslName: string, lastName: string, password: string, email: string, image: Buffer): Promise<number> {
        // проверить что такого пользователя еще не существует
        const existingUser: User | null = await this.userRepo.findOneBy({ email: email });
        if (existingUser != null) {
            throw new Error(`user with email ${email} already exists!`);
        }

        // такого пользователя нет, создадим и сохраним его
        const newUser: User = new User();
        newUser.firstName = firslName;
        newUser.lastName = lastName;
        newUser.email = email;
        newUser.image = image;

        const hashedPassword: string = await bcrypt.hash(password, 10);
        newUser.password = hashedPassword;
        await this.userRepo.save(newUser);

        return newUser.id;
    }

    public async readUser(email: string): Promise<User> {
        const user: User | null = await this.userRepo.findOneBy({ email: email });
        if (user != null) {
            return user;
        }

        // нет такого пользователя
        throw new Error(`user with email ${email} does not exist!`);
    }

    public async updateUser(email: string, firstName?: string, lastName?: string, password?: string, image?: Buffer): Promise<number> {
        // проверить что такой пользователь существует
        const existingUser: User | null = await this.userRepo.findOneBy({ email: email });
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
        await this.userRepo.save(existingUser);

        return existingUser.id;
    }

    public async deleteUser(email: string) {
        // можно не проверять, что пользователя не существует
        // если его не существует, в базе как раз ничего не удалится
        await this.userRepo.delete({ email: email });

    }
}


