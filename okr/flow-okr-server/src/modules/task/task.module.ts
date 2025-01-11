import {Module} from "@nestjs/common";
import {DatabaseModule} from "../../database/database.module";
import {taskProviders} from "./task.providers";
import {TaskService} from "./task.service";

@Module({
    imports: [DatabaseModule],
    providers: [
        ...taskProviders,
        TaskService
    ],
    exports: [
        ...taskProviders,
    ]
})
export class TaskModule {}