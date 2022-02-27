import twilio from 'twilio';
class WhatsApp {
  twilioClient: twilio.Twilio;
  fromWhatsapp: string;
  constructor() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    this.fromWhatsapp = 'whatsapp:+14155238886';
    console.log(accountSid, authToken);
    this.twilioClient = twilio(accountSid, authToken);
  }

  sendMessage(to: string, message: string, url?: string[]) {
    return this.twilioClient.messages.create({ from: this.fromWhatsapp, to, body: message, mediaUrl: url });
  }
}

export default new WhatsApp();
