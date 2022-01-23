import Mailer, { EmailOptions } from './mailer';

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

  protected sms = (data: SmsOptions) => {
    return true;
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
  send = async (data: SmsOptions) => {
    return await this.sms(data);
  };
}

const emailNotification = new EmailNotification();

export { emailNotification };
