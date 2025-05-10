import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Patient } from '../patients/entities/patient.entity';
import { AttendanceChartPeriod } from './enums/attendance-chart-period.enum';
import { AttendanceStatisticsResponse } from './interfaces/attendance-statistics.interface';
import { AllergyStatisticsResponse } from './interfaces/allergy-statistics.interface';
import { ChronicDiseaseStatisticsResponse } from './interfaces/chronic-disease-statistics.interface';
import { BloodTypeStatisticsResponse } from './interfaces/blood-type-statistics.interface';
import {
  startOfDay,
  endOfDay,
  subDays,
  subMonths,
  subYears,
  format,
  eachDayOfInterval,
  eachMonthOfInterval,
} from 'date-fns';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Patient)
    private patientsRepository: Repository<Patient>,
  ) {}

  async getAttendanceStatistics(
    period: AttendanceChartPeriod,
  ): Promise<AttendanceStatisticsResponse[]> {
    const now = new Date();
    let startDate: Date;
    const endDate: Date = now;

    // Определяем начальную дату в зависимости от периода
    switch (period) {
      case AttendanceChartPeriod.LAST_WEEK:
        startDate = subDays(now, 7);
        return this.getDailyStatistics(startDate, endDate);
      case AttendanceChartPeriod.LAST_MONTH:
        startDate = subMonths(now, 1);
        return this.getDailyStatistics(startDate, endDate);
      case AttendanceChartPeriod.LAST_YEAR:
        startDate = subYears(now, 1);
        return this.getMonthlyStatistics(startDate, endDate);
      default:
        throw new Error('Неизвестный период');
    }
  }

  private async getDailyStatistics(
    startDate: Date,
    endDate: Date,
  ): Promise<AttendanceStatisticsResponse[]> {
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    const statistics: AttendanceStatisticsResponse[] = [];

    for (const day of days) {
      const dayStart = startOfDay(day);
      const dayEnd = endOfDay(day);

      const count = await this.patientsRepository.count({
        where: {
          createdAt: Between(dayStart, dayEnd),
        },
      });

      statistics.push({
        date: format(day, 'yyyy-MM-dd'),
        value: count,
      });
    }

    return statistics;
  }

  private async getMonthlyStatistics(
    startDate: Date,
    endDate: Date,
  ): Promise<AttendanceStatisticsResponse[]> {
    const months = eachMonthOfInterval({ start: startDate, end: endDate });
    const statistics: AttendanceStatisticsResponse[] = [];

    for (const month of months) {
      const monthStart = startOfDay(month);
      const monthEnd = endOfDay(
        new Date(month.getFullYear(), month.getMonth() + 1, 0),
      );

      const count = await this.patientsRepository.count({
        where: {
          createdAt: Between(monthStart, monthEnd),
        },
      });

      statistics.push({
        date: format(month, 'yyyy-MM'),
        value: count,
      });
    }

    return statistics;
  }

  async getAllergyStatistics(): Promise<AllergyStatisticsResponse[]> {
    // Получаем всех пациентов
    const patients = await this.patientsRepository.find({
      select: ['allergies', 'is_other_allergies', 'other_allergies'],
    });

    // Создаем мапу для подсчета аллергий
    const allergyCount = new Map<string, number>();
    let otherAllergiesCount = 0;

    // Обрабатываем каждого пациента
    for (const patient of patients) {
      // Считаем стандартные аллергии
      if (patient.allergies && patient.allergies.length > 0) {
        for (const allergy of patient.allergies) {
          const currentCount = allergyCount.get(allergy) || 0;
          allergyCount.set(allergy, currentCount + 1);
        }
      }

      // Считаем другие аллергии
      if (patient.is_other_allergies && patient.other_allergies) {
        otherAllergiesCount++;
      }
    }

    // Преобразуем мапу в массив объектов
    const statistics: AllergyStatisticsResponse[] = Array.from(
      allergyCount.entries(),
    ).map(([type, value]) => ({
      type,
      value,
    }));

    // Добавляем статистику по другим аллергиям
    if (otherAllergiesCount > 0) {
      statistics.push({
        type: 'other',
        value: otherAllergiesCount,
      });
    }

    // Сортируем по количеству (по убыванию)
    return statistics.sort((a, b) => b.value - a.value);
  }

  async getChronicDiseaseStatistics(): Promise<
    ChronicDiseaseStatisticsResponse[]
  > {
    // Получаем всех пациентов
    const patients = await this.patientsRepository.find({
      select: [
        'chronic_diseases',
        'is_other_diseases',
        'other_chronic_diseases',
      ],
    });

    // Создаем мапу для подсчета заболеваний
    const diseaseCount = new Map<string, number>();
    let otherDiseasesCount = 0;

    // Обрабатываем каждого пациента
    for (const patient of patients) {
      // Считаем стандартные заболевания
      if (patient.chronic_diseases && patient.chronic_diseases.length > 0) {
        for (const disease of patient.chronic_diseases) {
          const currentCount = diseaseCount.get(disease) || 0;
          diseaseCount.set(disease, currentCount + 1);
        }
      }

      // Считаем другие заболевания
      if (patient.is_other_diseases && patient.other_chronic_diseases) {
        otherDiseasesCount++;
      }
    }

    // Преобразуем мапу в массив объектов
    const statistics: ChronicDiseaseStatisticsResponse[] = Array.from(
      diseaseCount.entries(),
    ).map(([type, value]) => ({
      type,
      value,
    }));

    // Добавляем статистику по другим заболеваниям
    if (otherDiseasesCount > 0) {
      statistics.push({
        type: 'other',
        value: otherDiseasesCount,
      });
    }

    // Сортируем по количеству (по убыванию)
    return statistics.sort((a, b) => b.value - a.value);
  }

  async getBloodTypeStatistics(): Promise<BloodTypeStatisticsResponse[]> {
    // Получаем всех пациентов
    const patients = await this.patientsRepository.find({
      select: ['blood_type'],
    });

    // Создаем мапу для подсчета групп крови
    const bloodTypeCount = new Map<string, number>();

    // Обрабатываем каждого пациента
    for (const patient of patients) {
      if (patient.blood_type) {
        const currentCount = bloodTypeCount.get(patient.blood_type) || 0;
        bloodTypeCount.set(patient.blood_type, currentCount + 1);
      }
    }

    // Преобразуем мапу в массив объектов
    const statistics: BloodTypeStatisticsResponse[] = Array.from(
      bloodTypeCount.entries(),
    ).map(([type, value]) => ({
      type,
      value,
    }));

    // Сортируем по количеству (по убыванию)
    return statistics.sort((a, b) => b.value - a.value);
  }
}
