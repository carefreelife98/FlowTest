import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {TaskModule} from "./modules/task/task.module";
import {TaskController} from "./modules/task/task.controller";
import {TaskService} from "./modules/task/task.service";

@Module({
  imports: [
      TaskModule,
  ],
  controllers: [AppController, TaskController],
  providers: [AppService, TaskService],
})
export class AppModule {}
