import twilio from 'twilio';

class Twilio {
  twClient: twilio.Twilio;
  fromWhatsapp = 'whatsapp:+14155238886';
  messageServiceId = process.env.MESSAGE_SERVICE_ID as string;

  constructor() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    this.twClient = twilio(accountSid, authToken);
  }

  sendWhatsappMessage(to: string, message: string, url?: string[]) {
    return this.twClient.messages.create({ from: this.fromWhatsapp, to, body: message, mediaUrl: url });
  }

  sendSMS(to: string, message: string) {
    return this.twClient.messages.create({
      messagingServiceSid: this.messageServiceId,
      to,
      body: message,
    });
  }
}

export const twilioApi = new Twilio();
