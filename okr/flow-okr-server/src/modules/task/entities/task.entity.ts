import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany} from 'typeorm';
import {TaskClosure} from "./task-closure.entity";

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "text" })
    content: string;

    @OneToMany(() => TaskClosure, (closure) => closure.ancestor)
    ancestorRelations: TaskClosure[];

    @OneToMany(() => TaskClosure, (closure) => closure.descendant)
    descendantRelations: TaskClosure[];
}
