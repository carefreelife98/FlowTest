import {Body, Controller, Get, Inject, Post, Query} from "@nestjs/common";
import {TaskService} from "./task.service";
import {AddTaskRequestDto} from "./dto/TaskRequestDto";
import {AddTaskDetailRequestDto} from "./dto/TaskDetailRequestDto";

@Controller('api/task')
export class TaskController {
    constructor(
       private taskService: TaskService,
    ) {}

    @Post()
    async addTask(@Body() dto: AddTaskRequestDto) {
        console.log(`ADD TASK DTO ::: ${JSON.stringify(dto)}`);
        return await this.taskService.addTask(dto);
    }

    @Post('/detail')
    async addTaskDetail(@Body() dto: AddTaskDetailRequestDto) {
        console.log(`ADD TASK DETAIL DTO ::: ${JSON.stringify(dto)}`);
        return await this.taskService.addTaskDetail(dto);
    }

    @Get('/total')
    async getTotalTaskTree() {
        return await this.taskService.getTotalTaskTree();
    }

    @Get()
    async getSubTree(@Query('taskId') taskId: number) {
        return await this.taskService.getSubTree(taskId);
    }

    @Get('direct-descendant')
    async getDirectDescendant(@Query('taskId') taskId: number) {
        return await this.taskService.getDirectDescendant(taskId);
    }

    @Get('path')
    async getPath(@Query('taskId') taskId: number) {
        return await this.taskService.getPath(taskId);
    }

    @Get('/detail')
    async getTaskDetail(@Query('taskId') taskId: number) {
        return await this.taskService.getTaskDetail(taskId);
    }
}
