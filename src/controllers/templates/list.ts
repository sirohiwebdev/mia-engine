import { getDb } from 'database/connect';
import Template from 'models/templates';

const listTemplates = async (query: any, limit?: number, offset?: number) => {
  const db = getDb();
  const templateModel = new Template(db);

  return await templateModel.find(query, limit, offset);
};

export default listTemplates;
