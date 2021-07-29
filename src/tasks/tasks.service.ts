import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
// import { v4 as uuidv4 } from 'uuid';
import { v4 as uuidv4 } from 'uuid';
import { createTaskDto } from './dto/create-task.dto';
@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTaskById(id: string): Task {
    return this.tasks.find((task) => task.id === id);
  }

  createTask(createTaskDto: createTaskDto): Task {
    const { title, description } = createTaskDto;
    const task: Task = {
      id: uuidv4(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }

  updateTask(id: string, status: TaskStatus) {
    const task = this.getTaskById(id);
    task.status = status;
    return task;
  }

  deleteTask(id: string): Task {
    const index = this.tasks.findIndex((t) => t.id === id);
    const task = this.tasks[index];
    this.tasks.splice(index, 1);
    return task;
  }
}
