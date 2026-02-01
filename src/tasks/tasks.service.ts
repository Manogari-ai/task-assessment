import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CurrentUser } from '../common/guards/decorators/current-user.decorator';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private readonly taskRepo: Repository<Task>,
    ) { }

    // ✅ CREATE
    async create(dto: CreateTaskDto, userId: number): Promise<Task> {

        const task = this.taskRepo.create({
            ...dto,
            user_id: userId,   // 👈 taken from JWT
        });

        return this.taskRepo.save(task);
    }



    /// ✅ FIND ALL with pagination meta
    async findAll(
        page: number,
        limit: number,
        userId: number,
        status?: string,
    ) {
        const query = this.taskRepo
            .createQueryBuilder('task')
            .where('task.user_id = :userId', { userId });

        if (status) {
            query.andWhere('task.status = :status', { status });
        }

        const [data, total] = await query
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();

        const totalPages = Math.ceil(total / limit);

        return {
            data,
            meta: {
                currentPage: page,
                perPage: limit,
                totalRecords: total,
                totalPages: totalPages,
            },
        };
    }


    // ✅ UPDATE
    async update(
        id: number,
        dto: UpdateTaskDto,
        userId: number,
    ): Promise<Task> {

        const task = await this.taskRepo.findOne({
            where: { id },
        });

        if (!task) {
            throw new NotFoundException('Task not found');
        }

        if (task.user_id !== userId) {
            throw new ForbiddenException('You are not allowed to update this task');
        }

        await this.taskRepo.update(id, dto);

        // task definitely exists here
        return this.taskRepo.findOneBy({ id }) as Promise<Task>;
    }



    // ✅ REMOVE (with owner check)
    async remove(id: number, userId: number) {

        const task = await this.taskRepo.findOne({
            where: { id },
        });

        if (!task) {
            throw new NotFoundException('Task not found');
        }

        if (task.user_id !== userId) {
            throw new ForbiddenException('You are not allowed to delete this task');
        }

        await this.taskRepo.delete(id);

        return {
            success: true,
            message: 'Task deleted successfully',
        };
    }
}
