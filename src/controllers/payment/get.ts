import { getDb } from 'database/connect';
import { IPayment, PaymentModel } from 'models';

export const get = async (props: Pick<IPayment, '_id' | 'user' | 'subscription'>) => {
  const db = getDb();
  const payment = new PaymentModel(db);
  const getPayment = await payment.find(props);

  return getPayment[0];
};
