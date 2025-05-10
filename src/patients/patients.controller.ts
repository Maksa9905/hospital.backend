import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  ValidationPipe,
  UsePipes,
  Query,
} from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { Patient } from './entities/patient.entity';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { PaginatedResponse } from './interfaces/pagination.interface';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createPatientDto: CreatePatientDto): Promise<Patient> {
    try {
      return await this.patientsService.create(createPatientDto);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Неизвестная ошибка';
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Ошибка при создании пациента',
          details: errorMessage,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResponse<Patient>> {
    try {
      return await this.patientsService.findAll(paginationQuery);
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Ошибка при получении списка пациентов',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Patient> {
    try {
      return await this.patientsService.findOne(id);
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Пациент не найден',
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(
    @Param('id') id: string,
    @Body() updatePatientDto: Partial<CreatePatientDto>,
  ): Promise<Patient> {
    try {
      return await this.patientsService.update(id, updatePatientDto);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Неизвестная ошибка';
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Ошибка при обновлении данных пациента',
          details: errorMessage,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    try {
      await this.patientsService.remove(id);
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Ошибка при удалении пациента',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
