import { getDb } from 'database/connect';
import Invitation, { IInvitation } from 'models/invitation';

const listInvitations = async (query, user: string, limit?: number, page?: number) => {
  const db = getDb();
  const invitationModel = new Invitation(db);
  return await invitationModel.find({ ...query, user }, limit, page);
};

export default listInvitations;
