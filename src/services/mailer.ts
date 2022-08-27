import path from 'path';

import Email from 'email-templates';
import nodemailer, { Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

import { fromEmail, smtpHost, smtpPassword, smtpPort, smtpUsername } from '../configs';

/**
 * Types of email template we currently have to send emails
 *
 * If we wish to modify templates or add new here please change this type according
 *
 * Each value in the type corresponds to the name of the folder of a template
 *
 * static/templates/emails/<template-name>
 */
export type EmailTemplates =
  | 'shop-created'
  | 'seller-email-verify'
  | 'seller-forgot-password'
  | 'user-email-verify'
  | 'user-forgot-password';

export type EmailOptions = {
  /**
   * Email-address to which send the email
   */
  to: string;
  /**
   * Data to be passed to template.
   *
   * Can be different for different templates
   */
  data: any;
  template: EmailTemplates;
};

/**
 * A mailer service on top of nodemailer and email-templates to send emails.
 */

export default class Mailer {
  transporter: Transporter<SMTPTransport.SentMessageInfo>;
  email: Email;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: smtpHost,
      port: Number(smtpPort),
      auth: {
        user: smtpUsername,
        pass: smtpPassword,
      },
    });

    this.email = new Email({
      transport: this.transporter,
      preview: false,
      send: true,
      message: {
        from: fromEmail,
      },
      views: {
        options: {
          extension: 'ejs',
        },
      },
    });
  }

  /**
   * Sends an e-mail
   */
  sendMail = async ({ data, template, to }: EmailOptions) => {
    return await this.email.send({
      template: path.join(__dirname, '../../', 'static', 'emails', 'templates', template),
      message: { to },
      locals: data,
    });
  };

  sendSimpleTextMail = async (to: string, subject: string, message: string, html = '') => {
    const sent = this.transporter.sendMail({
      from: fromEmail,
      subject,
      to,
      text: message,
      html: html || message,
    });

    return await sent;
  };
}

// const mailer = new Mailer();
// mailer.sendSimpleTextMail('sirohiwebdev@gmail.com', 'Hi', "Hi Abhishek What's up").then(console.log).catch(console.log);
