import { MailerService } from '@nestjs-modules/mailer';
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

interface EmailVerificationPayload {
  to: string;
  token: string;
  name: string;
}

interface ForgotPasswordPayload {
  to: string;
  token: string;
  name: string;
}

@Controller()
export class AppController {
  constructor(private readonly mailerService: MailerService) {}

  @EventPattern('send-email-verification-mail')
  sendEmailVerificationMail(@Payload() message: EmailVerificationPayload) {
    this.mailerService.sendMail({
      to: message.to,
      subject: 'Complete Your Registration',
      template: 'email-verification',
      context: {
        name: message.name,
        token: message.token,
      },
    });
    return;
  }

  @EventPattern('send-forgot-password-mail')
  sendForgotPasswordMail(@Payload() message: ForgotPasswordPayload) {
    this.mailerService.sendMail({
      to: message.to,
      subject: 'Reset Your Password',
      template: 'forgot-password',
      context: {
        name: message.name,
        token: message.token,
      },
    });
    return;
  }
}
