import Mailer, { EmailOptions } from './mailer';
import { twilioApi } from './twilio';

export type NotificationType = 'sms' | 'email';
export type SmsOptions = any;

class Notification {
  mailer: Mailer;

  constructor() {
    this.mailer = new Mailer();
  }
  protected mailWithTemplate = async (data: EmailOptions) => {
    return await this.mailer.sendMail(data);
  };

  protected mail = async (to: string, subject: string, message: string, html = '') => {
    return await this.mailer.sendSimpleTextMail(to, subject, message, html);
  };

  protected sms = (to: string, message: string) => {
    return twilioApi.sendSMS(to, message);
  };
}

class EmailNotification extends Notification {
  send = async (to: string, subject: string, message: string, html = '') => {
    return await this.mail(to, subject, message, html);
  };

  sendTemplate = async (data: EmailOptions) => {
    return await this.mailWithTemplate(data);
  };
}

class SMSNotification extends Notification {
  send = async (to: string, message: string) => {
    return await this.sms(to, message);
  };
}

const emailNotification = new EmailNotification();
const smsNotification = new SMSNotification();

export { emailNotification, smsNotification };
