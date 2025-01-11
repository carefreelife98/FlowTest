import {Inject, Injectable} from "@nestjs/common";
import {Repository} from "typeorm";
import {Task} from "./entities/task.entity";
import {TaskClosure} from "./entities/task-closure.entity";

@Injectable()
export class TaskService {
    constructor(
        @Inject('TASK_REPOSITORY')
        private taskRepository: Repository<Task>,
        @Inject('TASK_CLOSURE_REPOSITORY')
        private taskClosureRepository: Repository<TaskClosure>,
    ) {}

    // async getTasks() {
    //     return await this.taskRepository.find();
    // }

    async addTask(content: string, parentId: number | null) {
        // 새로운 Task 생성
        const newTask = this.taskRepository.create({ content });
        await this.taskRepository.save(newTask);

        if (parentId) {
            // 부모 Task 찾기
            const parentTask = await this.taskRepository.findOne({ where: { id: parentId } });
            if (!parentTask) throw new Error("Parent Task not found");

            // 부모 Task의 조상 관계 가져오기
            const parentRelations = await this.taskClosureRepository.find({
                where: { descendantId: parentTask.id },
            });

            // 새로운 관계 생성
            const newRelations = parentRelations.map((relation) =>
                this.taskClosureRepository.create({
                    ancestorId: relation.ancestorId,
                    descendantId: newTask.id,
                    depth: relation.depth + 1,
                })
            );

            // 자기 자신과의 관계 추가
            newRelations.push(
                this.taskClosureRepository.create({
                    ancestorId: newTask.id,
                    descendantId: newTask.id,
                    depth: 0,
                })
            );

            await this.taskClosureRepository.save(newRelations);
        } else {
            // 루트 Task 삽입
            await this.taskClosureRepository.save(
                this.taskClosureRepository.create({
                    ancestorId: newTask.id,
                    descendantId: newTask.id,
                    depth: 0,
                })
            );
        }

        return newTask;
    }

    async getSubTree(taskId: number) {
        const subTree = await this.taskClosureRepository
            .createQueryBuilder("closure")
            .innerJoinAndSelect("closure.descendant", "descendant")
            .where("closure.ancestor = :id", { id: taskId })
            .orderBy("closure.depth", "ASC")
            .getMany();

        return subTree.map((relation) => relation.descendant);
    }
    
    async getDirectDescendant(taskId: number) {
        const descendants = await this.taskClosureRepository
            .createQueryBuilder('closure')
            .innerJoinAndSelect('closure.descendant', 'descendant')
            .where('closure.ancestor = :id', { id: taskId })
            .andWhere('closure.depth = 1')
            .orderBy('closure.depth', 'ASC')
            .getMany();

        return descendants.map((relation) => relation.descendant);
    }



    async getPath(taskId: number) {
        const path = await this.taskClosureRepository
            .createQueryBuilder("closure")
            .innerJoinAndSelect("closure.ancestor", "ancestor")
            .where("closure.descendant = :id", { id: taskId })
            .orderBy("closure.depth", "ASC")
            .getMany();

        return path.map((relation) => relation.ancestor);
    }

}