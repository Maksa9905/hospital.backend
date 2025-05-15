import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from 'src/patients/entities/patient.entity';
import { VitalSigns } from './interfaces/vital-signs.interface';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class VitalSignsGeneratorService implements OnModuleInit {
  private readonly UPDATE_INTERVAL = 30 * 1000; // 30 секунд
  private readonly ADMIN_EMAIL = 'maksa9905@yandex.ru'; // Можно вынести в конфиг

  private timer: NodeJS.Timeout;

  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    private readonly emailService: EmailService,
  ) {}

  onModuleInit() {
    this.startGeneration();
  }

  startGeneration() {
    this.timer = setInterval(() => {
      this.generateVitalSigns();
    }, this.UPDATE_INTERVAL);
    console.log('Vital signs generator started (30s interval)');
  }

  async generateVitalSigns() {
    try {
      const patients = await this.patientRepository.find();

      for (const patient of patients) {
        const updatedData = {
          temperature: this.generateTemperature(),
          bloodPressureSystolic: this.generateSystolicPressure(),
          bloodPressureDiastolic: this.generateDiastolicPressure(),
          pulse: this.generatePulse(),
        };

        await this.patientRepository.update(patient.id, updatedData);
        await this.checkCriticalConditions(patient, updatedData);
      }

      console.log(`Updated vital signs for ${patients.length} patients`);
    } catch (err) {
      console.error('Error generating vital signs:', JSON.stringify(err));
    }
  }

  private generateTemperature(): number {
    return Math.round((35 + Math.random() * 6) * 10) / 10; // 35.0 - 41.0
  }

  private generateSystolicPressure(): number {
    return 100 + Math.floor(Math.random() * 51); // 100-150
  }

  private generateDiastolicPressure(): number {
    return 60 + Math.floor(Math.random() * 41); // 60-100
  }

  private generatePulse(): number {
    return 60 + Math.floor(Math.random() * 71); // 60-130
  }

  onApplicationShutdown() {
    clearInterval(this.timer);
    console.log('Vital signs generator stopped');
  }

  private async checkCriticalConditions(
    patient: Patient,
    vitalSigns: VitalSigns,
  ) {
    const { firstName, lastName, middleName, email } = patient;
    const fullName = `${lastName} ${firstName} ${middleName || ''}`.trim();

    if (vitalSigns.temperature > 40) {
      await this.sendAlert(
        `У пациента ${fullName} температура ${vitalSigns.temperature}°C`,
        email,
      );
    }

    if (vitalSigns.bloodPressureSystolic > 140) {
      await this.sendAlert(
        `У пациента ${fullName} давление ${vitalSigns.bloodPressureSystolic}/${vitalSigns.bloodPressureDiastolic}`,
        email,
      );
    }

    if (vitalSigns.pulse > 120) {
      await this.sendAlert(
        `У пациента ${fullName} пульс ${vitalSigns.pulse}`,
        email,
      );
    }
  }

  private async sendAlert(message: string, patientEmail?: string) {
    const emails = [this.ADMIN_EMAIL];
    if (patientEmail) emails.push(patientEmail);

    try {
      await this.emailService.sendCriticalAlert(
        emails.join(','),
        'Критическое состояние пациента',
        message,
      );
      console.log(`Alert sent: ${message}`);
    } catch (err) {
      console.error('Failed to send alert:', JSON.stringify(err));
    }
  }
}
