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

    @Column({ type: "bytea", })
    image!: Buffer;

    @Column({ type: "bytea", })
    pdf!: Buffer;
}
