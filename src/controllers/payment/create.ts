import { getDb } from 'database/connect';
import { PaymentModel } from 'models';
import { IPayment } from 'models';

const createPayment = async (props: IPayment) => {
  const db = getDb();
  const invitationModel = new PaymentModel(db);

  return await invitationModel.insert(props);
};

export default createPayment;
