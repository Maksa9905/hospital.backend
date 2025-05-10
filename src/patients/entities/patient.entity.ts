import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

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
