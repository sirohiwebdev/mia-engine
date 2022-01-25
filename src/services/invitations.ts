import path from 'path';

import { IInvitationTemplateData, InvitationTemplateContent } from '@sirohiwebdev/mia-core';
import Jimp from 'jimp';
import { v4 } from 'uuid';

import { getContentDimensions, getImageDimensions } from './image';

const addPrintContent = async (
  image: Jimp,
  content: InvitationTemplateContent,
  template: { width: number; height: number },
) => {
  const { source, properties, x, y } = content;
  // const { x, y } = getContentDimensions({ template, content });

  const font = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
  const width = Jimp.measureText(font, source);
  const height = Jimp.measureTextHeight(font, source, width);

  const textImage = new Jimp(width, height);
  await textImage.print(font, 0, 0, source);

  if (properties && properties.color) {
    console.log('Applying color', properties.color, Jimp.cssColorToHex(properties.color));
    await textImage.color([{ apply: 'xor', params: [properties.color] }]);
  }

  await textImage.writeAsync('text.png');
  await image.blit(textImage, x, y);
};

export const imageGenerator = async (template: IInvitationTemplateData & { image: string }) => {
  const { width, height, contents, image } = template;

  const { w, h } = getImageDimensions(width, height);

  const jImage = await Jimp.read(image);

  const textContents = contents.filter((c) => c.type === 'text');

  for (const c of textContents) {
    await addPrintContent(jImage, c, { ...template });
  }

  await jImage.writeAsync('before.png');
  await jImage.resize(w, h);
  await jImage.quality(100);
  const imageName = `${v4()}.${jImage.getExtension()}`;
  const imageOutPath = path.join(__dirname, '..', '..', 'uploads', 'invitations', imageName);
  await jImage.writeAsync(imageOutPath);

  return imageName;
};

const template = {
  id: '1643117161428',
  name: 'Baby Shower',
  height: 557,
  layout: 'portrait' as any,
  width: 399,
  contents: [
    {
      id: 'temp-content-1',
      label: 'Bride',
      x: 160,
      y: 85,
      properties: {
        color: 'aqua',
      },
      type: 'text' as any,
      source: 'Hello',
      w: 100,
      h: 40,
    },
    {
      id: 'temp-content-2',
      label: 'Groom',
      x: 160,
      y: 160,
      properties: {
        color: 'red',
      },
      type: 'text' as any,
      source: 'Sarah',
      w: 100,
      h: 40,
    },
  ],
  image: 'https://i.ibb.co/GQykRBD/invitation1-incomplete.png',
};

imageGenerator(template).then(console.log).catch(console.error);
