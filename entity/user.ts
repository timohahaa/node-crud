import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 60, nullable: false })
    password!: string;

    @Column({ type: "varchar", length: 100, nullable: false, })
    firstName!: string;

    @Column({ type: "varchar", length: 100, nullable: false, })
    lastName!: string;

    @Column({ type: "varchar", length: 100, nullable: false, unique: true })
    email!: string;

    @Column({ type: "bytea", nullable: true })
    image!: Buffer;

    @Column({ type: "bytea", nullable: true })
    pdf!: Buffer;

    // чтобы легче было возвращать пользователя в хттп-контроллерах
    toJson(): any {
        return {
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            image: this.image.toString('base64'),
        }
    }
}
