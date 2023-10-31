import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    BaseEntity,
    ManyToOne
} from "typeorm";
import { User } from "./User.entity";

@Entity()
export class Product  extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique:true})
    title: string;

    @Column()
    image: string;

    @Column()
    price: number;

    @ManyToOne(() => User, (user) => user.products)
    user: User
}
