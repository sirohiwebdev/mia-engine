import { Request, Response, NextFunction } from 'express';

import { getDb } from 'database/connect';
import { TokenModel } from 'models';
import { emailNotification, smsNotification } from 'services/notification';

const consentMessage = 'Please never respond to call or email asking for your password, otp or personal information';

const emailType: { [k: string]: (data: any) => { subject: string; message: string; html: string } } = {
  user_registration: ({ email, token }: { email: string; token: string }) => ({
    subject: 'Email Verification',
    message: `Your one time password for registering on My Invitation App is ${token}. ${consentMessage}`,
    html: `<p>Your one time password for registering on My Invitation App is <strong>${token}</strong> <br/> ${consentMessage} </p>`,
  }),

  reset_password: ({ email, token }: { email: string; token: string }) => ({
    subject: 'Reset Password',
    message: `Your one time password for verifying your email to reset your account password is  ${token}. ${consentMessage}`,
    html: `<p>Your one time password for verifying your email to reset your account password is  <strong>${token}</strong> <br/> ${consentMessage} </p>`,
  }),
};

export const sendOtp = async (req: Request, res: Response, next: NextFunction) => {
  const { email, mobile, type } = req.body;

  const validationModel = new TokenModel(getDb());
  try {
    const { token, validationSession } = await validationModel.createToken(mobile || email);
    const { subject, message, html } = emailType[type]({ email, token });
    if (mobile) {
      await smsNotification.send(mobile, message);
    }
    if (email) await emailNotification.send(email, subject, message, html);
    return res.status(200).json({ message: 'Sent Successfully', validationSession });
  } catch (err) {
    console.error(err);
    return res.status(400).send({ error: err.message });
  }
};
