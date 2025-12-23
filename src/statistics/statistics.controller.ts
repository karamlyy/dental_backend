// src/stats/stats.controller.ts
import { Controller, Get, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { StatsService } from './statistics.service';

@ApiTags('Stats')
@ApiBearerAuth()
@Controller('stats')
export class StatsController {
  constructor(private readonly service: StatsService) {}

  @Get('home')
  getHomeStats(@Request() req) {
    return this.service.getHomeStats(req.user.sub);
  }
}