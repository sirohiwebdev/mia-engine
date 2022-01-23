import { getDb } from 'database/connect';
import Invitation, { IInvitation } from 'models/invitation';

const createInvitation = async (invitation: IInvitation) => {
  const db = getDb();
  const invitationModel = new Invitation(db);

  return await invitationModel.insert(invitation);
};

export default createInvitation;
