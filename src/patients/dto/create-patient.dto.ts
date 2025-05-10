import {
  IsString,
  IsEmail,
  IsDate,
  IsOptional,
  IsBoolean,
  IsArray,
  Matches,
  IsIn,
  IsPhoneNumber,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePatientDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;

  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(50)
  middleName?: string;

  @Type(() => Date)
  @IsDate()
  birthday: Date;

  @IsString()
  @IsIn(['male', 'female', 'other'])
  gender: string;

  @IsPhoneNumber('RU')
  phone: string;

  @IsEmail()
  email: string;

  @IsString()
  @Matches(/^\d{6}$/, { message: 'Почтовый индекс должен содержать 6 цифр' })
  postal_code: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  region: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  city: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  street: string;

  @IsString()
  @Matches(/^\d+[а-яА-Яa-zA-Z]?$/, {
    message: 'Номер дома должен содержать цифры и опционально букву',
  })
  house_number: string;

  @IsString()
  @Matches(/^\d{3}-\d{3}-\d{3} \d{2}$/, {
    message: 'СНИЛС должен быть в формате XXX-XXX-XXX XX',
  })
  snils: string;

  @IsString()
  @Matches(/^\d{4} \d{4} \d{4} \d{4}$/, {
    message: 'Номер полиса ОМС должен быть в формате XXXX XXXX XXXX XXXX',
  })
  MHI_number: string;

  @Type(() => Date)
  @IsDate()
  MHI_expiration_date: Date;

  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(200)
  polyclinic: string;

  @IsString()
  @IsIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
  blood_type: string;

  @IsArray()
  @IsString({ each: true })
  chronic_diseases: string[];

  @IsBoolean()
  is_other_diseases: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  other_chronic_diseases?: string[];

  @IsArray()
  @IsString({ each: true })
  allergies: string[];

  @IsBoolean()
  is_other_allergies: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  other_allergies?: string[];

  @IsString()
  @Matches(/^\d{2} \d{2}$/, {
    message: 'Серия паспорта должна быть в формате XX XX',
  })
  passport_series: string;

  @IsString()
  @Matches(/^\d{6}$/, { message: 'Номер паспорта должен содержать 6 цифр' })
  passport_number: string;

  @IsString()
  @MinLength(2)
  @MaxLength(200)
  passport_issued_by: string;

  @Type(() => Date)
  @IsDate()
  passport_issued_at: Date;
}
