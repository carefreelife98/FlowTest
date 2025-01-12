import {Entity, Column, PrimaryGeneratedColumn, OneToOne} from 'typeorm';
import {Task} from "./task.entity";

@Entity()
export class TaskDetail {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Task, (task) => task.detail)
    task: Task;

    @OneToOne(() => Task, (task) => task.title)
    title: string;

    @Column({ type: "text" })
    goal: string;

    @Column({ type: "text" })
    requirement: string;

    @Column({ type: "text" })
    achievement: string;

    @Column({ type: "text" })
    action_plan: string;
}
