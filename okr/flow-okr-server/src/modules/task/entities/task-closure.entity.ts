import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from "typeorm";
import { Task } from "./task.entity";

@Entity()
export class TaskClosure {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Task, (task) => task.ancestorRelations, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "ancestorId" }) // 관계를 명시적으로 지정
    ancestor: Task;

    @ManyToOne(() => Task, (task) => task.descendantRelations, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "descendantId" }) // 관계를 명시적으로 지정
    descendant: Task;

    @Column()
    ancestorId: number; // 정수 타입으로 정의

    @Column()
    descendantId: number; // 정수 타입으로 정의

    @Column({ type: "int" })
    depth: number;
}
