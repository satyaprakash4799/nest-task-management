import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './tas-status.enums';

export class TasksRepository extends Repository<Task> {}
