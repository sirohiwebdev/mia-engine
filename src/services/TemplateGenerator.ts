import { IInvitationTemplateData } from '@sirohiwebdev/mia-core';
import Jimp from 'jimp';

export class ImageTemplateGenerator {
  templateData: IInvitationTemplateData & { image: string };
  template: Jimp;
  constructor(data: IInvitationTemplateData & { image: string }) {
    this.templateData = data;
  }

  async load() {
    this.template = await Jimp.read(this.templateData.image);
  }

  async write(path) {
    await this.template.writeAsync(path);
  }
}
