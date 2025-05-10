import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { PaginatedResponse } from './interfaces/pagination.interface';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private patientsRepository: Repository<Patient>,
  ) {}

  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    const patient = this.patientsRepository.create(createPatientDto);
    return await this.patientsRepository.save(patient);
  }

  async findAll(
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResponse<Patient>> {
    const { page = 1, limit = 10 } = paginationQuery;
    const skip = (page - 1) * limit;

    const [patients, total] = await this.patientsRepository.findAndCount({
      skip,
      take: limit,
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      data: patients,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Patient> {
    return await this.patientsRepository.findOneOrFail({ where: { id } });
  }

  async update(
    id: string,
    updatePatientDto: Partial<CreatePatientDto>,
  ): Promise<Patient> {
    await this.patientsRepository.update(id, updatePatientDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.patientsRepository.delete(id);
  }

  async getChronicDiseasesStats(): Promise<
    { disease: string; count: number }[]
  > {
    const patients = await this.patientsRepository.find();
    const diseaseCounts = new Map<string, number>();

    patients.forEach((patient) => {
      // Подсчет стандартных заболеваний
      patient.chronic_diseases.forEach((disease) => {
        diseaseCounts.set(disease, (diseaseCounts.get(disease) || 0) + 1);
      });

      // Подсчет других заболеваний
      if (patient.is_other_diseases && patient.other_chronic_diseases) {
        patient.other_chronic_diseases.forEach((disease) => {
          diseaseCounts.set(disease, (diseaseCounts.get(disease) || 0) + 1);
        });
      }
    });

    return Array.from(diseaseCounts.entries())
      .map(([disease, count]) => ({ disease, count }))
      .sort((a, b) => b.count - a.count);
  }

  async getAllergiesStats(): Promise<{ allergy: string; count: number }[]> {
    const patients = await this.patientsRepository.find();
    const allergyCounts = new Map<string, number>();

    patients.forEach((patient) => {
      // Подсчет стандартных аллергий
      patient.allergies.forEach((allergy) => {
        allergyCounts.set(allergy, (allergyCounts.get(allergy) || 0) + 1);
      });

      // Подсчет других аллергий
      if (patient.is_other_allergies && patient.other_allergies) {
        patient.other_allergies.forEach((allergy) => {
          allergyCounts.set(allergy, (allergyCounts.get(allergy) || 0) + 1);
        });
      }
    });

    return Array.from(allergyCounts.entries())
      .map(([allergy, count]) => ({ allergy, count }))
      .sort((a, b) => b.count - a.count);
  }
}
