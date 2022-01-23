import { getDb } from 'database/connect';
import Template, { ITemplate } from 'models/templates';

const createTemplate = async (template: ITemplate) => {
  const db = getDb();
  const templateModel = new Template(db);

  return await templateModel.insert(template);
};

export default createTemplate;
