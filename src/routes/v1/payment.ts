import { Router, Request, NextFunction, Response } from 'express';

import { verifyPayment } from 'controllers/payment';
import { gateway } from 'services/razorpay';

const router = Router();

router.post('/verify', async (req: Request, res: Response, next: NextFunction) => {
  const { body, headers } = req;
  console.log('Body', body);
  const signature = headers['x-razorpay-signature'];
  if (!signature || !gateway.validateSignature(JSON.stringify(body), signature)) {
    console.log('Not found signature');
    res.status(400).json({ message: 'Invalid signature' });
  }

  await verifyPayment(body);

  return res.json({});
});

export default router;
