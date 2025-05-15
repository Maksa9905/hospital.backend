import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsNumber, IsOptional, Min, Max } from 'class-validator';

@Entity('patients')
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Personal Info
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  middleName: string;

  @Column({ type: 'date' })
  birthday: Date;

  @Column()
  gender: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  // Address
  @Column()
  postal_code: string;

  @Column()
  region: string;

  @Column()
  city: string;

  @Column()
  street: string;

  @Column()
  house_number: string;

  // Medical Info
  @Column()
  snils: string;

  @Column()
  MHI_number: string;

  @Column({ type: 'date' })
  MHI_expiration_date: Date;

  @Column({ nullable: true })
  polyclinic: string;

  @Column()
  blood_type: string;

  @Column('simple-array')
  chronic_diseases: string[];

  @Column({ default: false })
  is_other_diseases: boolean;

  @Column('simple-array', { nullable: true })
  other_chronic_diseases: string[];

  @Column('simple-array')
  allergies: string[];

  @Column({ default: false })
  is_other_allergies: boolean;

  @Column('simple-array', { nullable: true })
  other_allergies: string[];

  // Medical Metrics
  @Column({ type: 'numeric', precision: 3, scale: 1, nullable: true })
  @IsOptional()
  @IsNumber({}, { message: 'Temperature must be a number' })
  @Min(35.0, { message: 'Temperature too low' })
  @Max(41.0, { message: 'Temperature too high' })
  temperature: number;

  @Column({ type: 'smallint', nullable: true })
  @IsOptional()
  @IsNumber({}, { message: 'Systolic pressure must be a number' })
  @Min(100, { message: 'Systolic pressure too low' })
  @Max(150, { message: 'Systolic pressure too high' })
  bloodPressureSystolic: number;

  @Column({ type: 'smallint', nullable: true })
  @IsOptional()
  @IsNumber({}, { message: 'Diastolic pressure must be a number' })
  @Min(60, { message: 'Diastolic pressure too low' })
  @Max(100, { message: 'Diastolic pressure too high' })
  bloodPressureDiastolic: number;

  @Column({ type: 'smallint', nullable: true })
  @IsOptional()
  @IsNumber({}, { message: 'Pulse must be a number' })
  @Min(60, { message: 'Pulse too low' })
  @Max(130, { message: 'Pulse too high' })
  pulse: number;

  // Passport Info
  @Column()
  passport_series: string;

  @Column()
  passport_number: string;

  @Column()
  passport_issued_by: string;

  @Column({ type: 'date' })
  passport_issued_at: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
