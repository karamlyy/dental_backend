// src/stats/stats.controller.ts
import { Controller, Get, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { StatsService } from './statistics.service';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@ApiTags('Stats')
@ApiBearerAuth()
@Controller('stats')
export class StatsController {
  constructor(private readonly service: StatsService) { }

  @Roles(UserRole.DOCTOR, UserRole.ASSISTANT)
  @Get('home')
  getHomeStats(@Request() req) {
    return this.service.getHomeStats(req.user.doctorId);
  }
}