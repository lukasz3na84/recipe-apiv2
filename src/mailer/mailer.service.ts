import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as SendGrid from '@sendgrid/mail';

@Injectable()
export class MailerService {
  constructor(private readonly configService: ConfigService) {
    SendGrid.setApiKey(this.configService.get<string>('SENDGRID_API_KEY'));
  }

  async send(mail: SendGrid.MailDataRequired) {
    const transport = await SendGrid.send(mail);
    console.log(`E-mail sent to ${mail.to}`);
    return transport;
  }

  /*
  async sendWelcomeMail(email: string, name: string) {
    const mail = {
      to: email,
      from: 'ltrzyna@gmail.com',
      subject: 'Welcome to NESTJS',
    };
    return mail;
  }
  */
}
