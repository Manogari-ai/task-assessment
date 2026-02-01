import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CurrentUser } from '../common/guards/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
    constructor(private readonly service: TasksService) { }

    @Post()
    create(
        @CurrentUser() user: any,
        @Body() dto: CreateTaskDto,
    ) {
        return this.service.create(dto, user.id);
    }

    @Get()
    findAll(
        @CurrentUser() user: any,
        @Query('page') page = 1,
        @Query('limit') limit = 10,
        @Query('status') status?: string,
    ) {
        return this.service.findAll(page, limit, user.id,status);
    }

    @Patch(':id')
    update(
        @CurrentUser() user: any,
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateTaskDto,
    ) {
        return this.service.update(id, dto,user.id);
    }

    @Delete(':id')
    remove(@CurrentUser() user: any,@Param('id', ParseIntPipe) id: number) {
        return this.service.remove(id,user.id);
    }
}
