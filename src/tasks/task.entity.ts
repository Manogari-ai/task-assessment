import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
// Typeorm declare
@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int', nullable: true })
    user_id: number;

    @Column()
    title: string;

    @Column({ nullable: true })
    description: string;

    @Column({ default: 'pending' })
    status: string; // pending, in-progress, completed

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
