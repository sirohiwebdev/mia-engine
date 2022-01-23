import { ObjectId } from 'bson';

import { getDb } from 'database/connect';
import Invitation from 'models/invitation';

const getInvitation = async (id: string, user: string) => {
  const db = getDb();
  const invitationModel = new Invitation(db);
  return await invitationModel.find({ _id: new ObjectId(id), user });
};

export default getInvitation;
