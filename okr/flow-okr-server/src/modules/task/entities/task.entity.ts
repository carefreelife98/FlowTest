import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany} from 'typeorm';
import {TaskClosure} from "./task-closure.entity";

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "text" })
    title: string;

    @Column({ type: "text", nullable: true })
    content: string;

    @Column({ type: "int", nullable: true })
    rate: number;

    @Column({ type: "text", nullable: true })
    type: string;

    @OneToMany(() => TaskClosure, (closure) => closure.ancestor)
    ancestorRelations: TaskClosure[];

    @OneToMany(() => TaskClosure, (closure) => closure.descendant)
    descendantRelations: TaskClosure[];
}
