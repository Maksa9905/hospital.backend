import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { AttendanceStatisticsQueryDto } from './dto/attendance-statistics.dto';
import { AttendanceStatisticsResponse } from './interfaces/attendance-statistics.interface';
import { AllergyStatisticsResponse } from './interfaces/allergy-statistics.interface';
import { ChronicDiseaseStatisticsResponse } from './interfaces/chronic-disease-statistics.interface';
import { BloodTypeStatisticsResponse } from './interfaces/blood-type-statistics.interface';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('attendance')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getAttendanceStatistics(
    @Query() query: AttendanceStatisticsQueryDto,
  ): Promise<AttendanceStatisticsResponse[]> {
    return this.statisticsService.getAttendanceStatistics(query.period);
  }

  @Get('allergies')
  async getAllergyStatistics(): Promise<AllergyStatisticsResponse[]> {
    return this.statisticsService.getAllergyStatistics();
  }

  @Get('chronic-diseases')
  async getChronicDiseaseStatistics(): Promise<
    ChronicDiseaseStatisticsResponse[]
  > {
    return this.statisticsService.getChronicDiseaseStatistics();
  }

  @Get('blood-types')
  async getBloodTypeStatistics(): Promise<BloodTypeStatisticsResponse[]> {
    return this.statisticsService.getBloodTypeStatistics();
  }
}
