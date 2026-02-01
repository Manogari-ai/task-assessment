import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
  ) {}

  // ✅ CREATE
  async create(dto: CreateTaskDto): Promise<Task> {
    const task = this.taskRepo.create(dto);
    return this.taskRepo.save(task);
  }

  // ✅ FIND ALL
  async findAll(
    page: number,
    limit: number,
    status?: string,
  ): Promise<Task[]> {
    const query = this.taskRepo.createQueryBuilder('task');

    if (status) {
      query.where('task.status = :status', { status });
    }

    return query
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
  }

  // ✅ UPDATE
  async update(id: number, dto: UpdateTaskDto): Promise<Task | null> {
    await this.taskRepo.update(id, dto);
    return this.taskRepo.findOneBy({ id });
  }

  
  // ✅ REMOVE
  async remove(id: number) {
  const result = await this.taskRepo.delete(id);

  if (result.affected === 0) {
    throw new NotFoundException('Task not found');
  }

  return {
    success: true,
    message: 'Task deleted successfully',
  };
}
}
