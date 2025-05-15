import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VitalSignsGeneratorService } from './vital-signs-generator.service';
import { Patient } from 'src/patients/entities/patient.entity';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from 'src/email/email.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Patient]),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.yandex.ru',
        port: 587,
        secure: false,
        auth: {
          user: 'Maksa9905@yandex.ru',
          pass: 'mztbgamhnuzjsbrb',
        },
      },
      defaults: {
        from: 'Hospital Admin <Maksa9905@yandex.ru>',
      },
    }),
  ],
  providers: [VitalSignsGeneratorService, EmailService],
})
export class VitalSignsModule {}
