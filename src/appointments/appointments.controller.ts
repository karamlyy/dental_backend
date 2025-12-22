import { Controller, Post, Patch, Get, Body, Param, Request } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@ApiTags('Appointments')
@ApiBearerAuth()
@Controller('appointments')
export class AppointmentsController {
  constructor(private service: AppointmentsService) {}

  @Get()
  findAll(@Request() req) {
    return this.service.findAllByDoctor(req.user.sub);
  }

  @Roles(UserRole.DOCTOR)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAppointmentDto, @Request() req) {
    return this.service.update(id, req.user.sub, dto);
  }
}