import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';

// auth service
@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepo: Repository<User>,
        private jwtService: JwtService,
    ) { }

    async register(email: string, password: string) {
        const existingUser = await this.userRepo.findOne({
            where: { email },
        });

        if (existingUser) {
            throw new BadRequestException('Email already exists');
        }

        const hashed = await bcrypt.hash(password, 10);

        const user = this.userRepo.create({
            email,
            password: hashed,
        });

        return this.userRepo.save(user);
    }

    async login(email: string, password: string) {
        const user = await this.userRepo.findOne({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return {
            access_token: this.jwtService.sign({ sub: user.id }),
        };
    }
}
