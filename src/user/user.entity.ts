import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
  } from 'typeorm';
  
  import { Order } from '../order/order.entity';
  
  @Entity('users')
  export class User {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ length: 150 })
    name: string;
  
    @Column({ unique: true, length: 255 })
    email: string;
  
    @OneToMany(() => Order, (order) => order.user)
    orders: Order[];
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }