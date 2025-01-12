import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    OneToMany,
    OneToOne, JoinColumn,
} from 'typeorm';
import {TaskClosure} from "./task-closure.entity";
import {TaskDetail} from "./task-detail.entity";

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => TaskDetail, (detail) => detail.title)
    @Column({ type: "text" })
    title: string;

    @Column({ type: "text", nullable: true })
    content: string;

    @Column({ type: "int", nullable: true })
    rate: number;

    @Column({ type: "text", nullable: true })
    type: string;
    
    @OneToOne(() => TaskDetail, (detail) => (detail.task), {cascade: true})
    @JoinColumn()
    detail: TaskDetail;

    @OneToMany(() => TaskClosure, (closure) => closure.ancestor)
    ancestorRelations: TaskClosure[];

    @OneToMany(() => TaskClosure, (closure) => closure.descendant)
    descendantRelations: TaskClosure[];
}
