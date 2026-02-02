import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
// class validation
export class CreateTaskDto {

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;
  
}
