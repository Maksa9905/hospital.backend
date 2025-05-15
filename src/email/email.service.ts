import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendCriticalAlert(email: string, subject: string, message: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: subject,
      text: message,
    });
  }
}
