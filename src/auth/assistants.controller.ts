import { Controller, Post, Get, Delete, Body, Param, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateAssistantDto } from '../users/dto/create-assistant.dto';
import { Roles } from './roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@ApiTags('Assistants')
@ApiBearerAuth()
@Controller('assistants')
export class AssistantsController {
    constructor(
        private authService: AuthService,
        private usersService: UsersService,
    ) { }

    @Roles(UserRole.DOCTOR)
    @Post()
    create(@Body() dto: CreateAssistantDto, @Request() req) {
        return this.authService.registerAssistant(dto, req.user.sub);
    }

    @Roles(UserRole.DOCTOR)
    @Get()
    findAll(@Request() req) {
        return this.usersService.findAssistantsByDoctor(req.user.sub);
    }

    @Roles(UserRole.DOCTOR)
    @Delete(':id')
    remove(@Param('id') id: string, @Request() req) {
        return this.usersService.removeAssistant(id, req.user.sub);
    }
}
