import { Controller, Get, Post, Body, Request, Delete, Param } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Services')
@ApiBearerAuth()
@Controller('services')
export class ServicesController {
    constructor(private readonly servicesService: ServicesService) { }

    @Post()
    create(@Request() req, @Body() createServiceDto: CreateServiceDto) {
        // req.user is the JWT payload.
        // payload.doctorId contains the doctor's ID (whether user is doctor or assistant).
        return this.servicesService.create(req.user.doctorId, createServiceDto);
    }

    @Get()
    findAll(@Request() req) {
        return this.servicesService.findAll(req.user.doctorId);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Request() req) {
        return this.servicesService.remove(id, req.user.doctorId);
    }
}
