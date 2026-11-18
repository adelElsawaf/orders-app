import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { OrderItem } from '../order-item/order-item.entity';
import { User } from 'src/user/user.entity';
import { OrderStatus } from './enums/order-status.enum';


@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.orders, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  totalAmount: string;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    cascade: ['insert'],
  })
  items: OrderItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}