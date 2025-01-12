import {Inject, Injectable} from "@nestjs/common";
import {Repository} from "typeorm";
import {Task} from "./entities/task.entity";
import {TaskClosure} from "./entities/task-closure.entity";
import {AddTaskRequestDto} from "./dto/TaskRequestDto";

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

    async addTask(dto: AddTaskRequestDto) {
        // 새로운 Task 생성
        const newTask = this.taskRepository.create({ title: dto.title, content: dto.content, rate: dto.rate, type: dto.type });
        await this.taskRepository.save(newTask);

        if (dto.parentId) {
            // 부모 Task 찾기
            const parentTask = await this.taskRepository.findOne({ where: { id: dto.parentId } });
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

    /**
     * 로직 설명
     * 1. 노드 초기화:
     * 모든 노드를 taskMap에 저장.
     * ancestorId와 descendantId 관계를 통해 초기화만 진행하며, 아직 부모-자식 관계를 연결하지 않음.
     *
     * 2. DFS 방식 트리 구축:
     * buildTree(nodeId) 함수는 현재 노드를 기준으로 자식 노드들을 재귀적으로 탐색하며 트리를 생성.
     * childSet은 이미 처리된 자손 노드를 기록해 중복 추가를 방지.
     *
     * 3. 루트 노드 탐색:
     * depth = 0 && ancestorId === descendantId 조건을 만족하는 노드를 루트로 설정한 후 buildTree를 호출해 트리를 생성.
     */
    async getTotalTaskTree(): Promise<any> {
        // TaskClosure에서 모든 데이터를 가져오기
        const closures = await this.taskClosureRepository.find({
            relations: ['ancestor', 'descendant'],
        });

        // 자손 노드의 집합 (중복 제거용)
        const childSet = new Set<number>();

        // 노드 정보 저장
        const taskMap = new Map<number, any>();

        closures.forEach((closure) => {
            const ancestorId = closure.ancestor.id;
            const descendantId = closure.descendant.id;

            // 조상 노드 초기화
            if (!taskMap.has(ancestorId)) {
                taskMap.set(ancestorId, {
                    id: ancestorId,
                    title: closure.ancestor.title,
                    content: closure.ancestor.content,
                    rate: closure.ancestor.rate,
                    type: closure.ancestor.type,
                    children: [],
                });
            }

            // 자손 노드 초기화
            if (!taskMap.has(descendantId)) {
                taskMap.set(descendantId, {
                    id: descendantId,
                    title: closure.descendant.title,
                    content: closure.descendant.content,
                    rate: closure.descendant.rate,
                    type: closure.descendant.type,
                    children: [],
                });
            }
        });

        // DFS로 트리를 생성하는 함수
        function buildTree(nodeId: number): any {
            if (childSet.has(nodeId)) return null; // 이미 처리된 노드는 스킵
            childSet.add(nodeId); // 현재 노드를 처리로 표시

            const node = taskMap.get(nodeId);
            const children = closures
                .filter((closure) => closure.ancestor.id === nodeId && closure.depth > 0)
                .map((closure) => buildTree(closure.descendant.id))
                .filter((child) => child !== null); // 유효한 자식만 추가

            node.children = children;
            return node;
        }

        // 루트 노드를 찾아 트리 생성
        const rootClosure = closures.find(
            (closure) => closure.depth === 0 && closure.ancestor.id === closure.descendant.id
        );

        return rootClosure ? buildTree(rootClosure.ancestor.id) : null;
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