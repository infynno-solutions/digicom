import { MailerService } from '@nestjs-modules/mailer';
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

interface EmailVerificationPayload {
  to: string;
  token: string;
  name: string;
}

@Controller()
export class AppController {
  constructor(private readonly mailerService: MailerService) {}

  @EventPattern('send-email-verification-mail')
  sendEmailVerificationMail(@Payload() message: EmailVerificationPayload) {
    console.log('Sending Mail', message);
    this.mailerService.sendMail({
      to: message.to,
      subject: 'Email Verification Required',
      template: 'email-verification',
      context: {
        name: message.name,
        token: message.token,
      },
    });
    return;
  }
}
