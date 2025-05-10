import { IsEnum } from 'class-validator';
import { AttendanceChartPeriod } from '../enums/attendance-chart-period.enum';

export class AttendanceStatisticsQueryDto {
  @IsEnum(AttendanceChartPeriod)
  period: AttendanceChartPeriod;
}
