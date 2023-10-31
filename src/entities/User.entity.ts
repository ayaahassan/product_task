import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    BaseEntity
} from "typeorm";
import { Product } from "./Product.entity";

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
   
    @Column({unique: true})
    email: string;

    @Column()
    password: string;
   
    @OneToMany(() => Product, (product) => product.user)
    products: Product[]
   
}
