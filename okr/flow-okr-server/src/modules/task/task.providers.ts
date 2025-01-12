import { DataSource } from 'typeorm';
import { Task } from './entities/task.entity';
import { TaskClosure } from './entities/task-closure.entity';
import {TaskDetail} from "./entities/task-detail.entity";

export const taskProviders = [
    {
        provide: 'TASK_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Task),
        inject: ['DATA_SOURCE'],
    },
    {
        provide: 'TASK_CLOSURE_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(TaskClosure),
        inject: ['DATA_SOURCE'],
    },
    {
        provide: 'TASK_DETAIL_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(TaskDetail),
        inject: ['DATA_SOURCE'],
    },
];
