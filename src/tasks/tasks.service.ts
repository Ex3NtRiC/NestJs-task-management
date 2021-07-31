import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { Task, TaskStatus } from './task.model';
// import { v4 as uuidv4 } from 'uuid';
import { createTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { User } from 'src/auth/user.entity';
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private readonly tasksRepository: TasksRepository,
  ) {}

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { search, status } = filterDto;
    let tasks = this.tasksRepository.createQueryBuilder('task').where({ user });
    if (status) {
      tasks = tasks.andWhere('status=:status', {
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

  async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.tasksRepository.findOne({ id, user });
    if (!found) {
      throw new NotFoundException(`Task with id:${id} is not found!`);
    }
    return found;
  }

  async createTask(createTaskDto: createTaskDto, user: User): Promise<Task> {
    return await this.tasksRepository.createTask(createTaskDto, user);
  }
  async updateTask(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<boolean> {
    const result = await this.tasksRepository.update(
      { id, user },
      { status: status },
    );
    if (result.affected === 0) {
      throw new NotFoundException(`Task with id:${id} is not found!`);
    }
    return true;
  }

  async deleteTask(id: string, user: User): Promise<boolean> {
    const deleted: number = await this.tasksRepository.deleteTask(id, user);
    if (deleted === 0) {
      throw new NotFoundException(`Task with id:${id} is not found!`);
    }
    return true;
  }
}
