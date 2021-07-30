import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { Task, TaskStatus } from './task.model';
// import { v4 as uuidv4 } from 'uuid';
import { createTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private readonly tasksRepository: TasksRepository,
  ) {}

  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const { search, status } = filterDto;
    let tasks = this.tasksRepository.createQueryBuilder('task');
    if (status) {
      tasks = tasks.where('status=:status', {
        status,
      });
    }
    if (search) {
      tasks = tasks.andWhere(
        '(LOWER(title) LIKE LOWER(:search) OR LOWER(description) LIKE LOWER(:search))',
        {
          search: '%' + search + '%',
        },
      );
    }
    return await tasks.getMany();
  }

  async getTaskById(id: string): Promise<Task> {
    const found = await this.tasksRepository.findOne(id);
    if (!found) {
      throw new NotFoundException(`Task with id:${id} is not found!`);
    }
    return found;
  }

  async createTask(createTaskDto: createTaskDto): Promise<Task> {
    return await this.tasksRepository.createTask(createTaskDto);
  }
  async updateTask(id: string, status: TaskStatus): Promise<boolean> {
    const result = await this.tasksRepository.update(id, { status: status });
    if (result.affected === 0) {
      throw new NotFoundException(`Task with id:${id} is not found!`);
    }
    return true;
  }

  async deleteTask(id: string): Promise<boolean> {
    const deleted: number = await this.tasksRepository.deleteTask(id);
    if (deleted === 0) {
      throw new NotFoundException(`Task with id:${id} is not found!`);
    }
    return true;
  }
}
