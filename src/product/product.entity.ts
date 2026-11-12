import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { PublishingStatus } from "./enums/publishing-status-enum";

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;
    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
        transformer: {
            to: (value: number) => value,
            from: (value: string) => Number(value),
        },
    })
    price: number;

    @Column({
        type: 'enum',
        enum: PublishingStatus,
        default: PublishingStatus.DRAFT,
    })
    publishingStatus: PublishingStatus;
    
    @Column({ type: 'boolean', default: false })
    isFeatured: boolean;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updatedAt: Date;
}