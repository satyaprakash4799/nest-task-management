import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './tas-status.enums';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: TasksRepository,
  ) {}

  async getTasks(filterDto: GetTaskFilterDto): Promise<Task[]> {
    const query = this.tasksRepository.createQueryBuilder('task');
    const { status, search } = filterDto;

    if (status) {
      query.andWhere('task.status = :status', { status: status });
    }

    if (search) {
      query.andWhere(
        'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
        { search: `%${search}%` },
      );
    }

    const tasks = await query.getMany();
    return tasks;
  }
  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = this.tasksRepository.create({
      title: title,
      description: description,
      status: TaskStatus.OPEN,
    });

    await this.tasksRepository.save(task);
    return task;
  }

  async getTaskById(id: string): Promise<Task> {
    const found = await this.tasksRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!found) {
      throw new NotFoundException(`Task with Id ${id} not found`);
    }
    return found;
  }
  async deleteTask(id: string): Promise<void> {
    const result = await this.tasksRepository.delete(id);

    if (result?.affected === 0) {
      throw new NotFoundException(`Task with Id ${id} not found`);
    }
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
  ): Promise<Task | undefined> {
    const task = await this.getTaskById(id);

    task.status = status;
    await this.tasksRepository.save(task);

    return task;
  }
}
