import { getImageDimensions, InvitationTemplateContent } from '@sirohiwebdev/mia-core';
import Jimp from 'jimp';
import { v4 } from 'uuid';

import { staticUrl } from 'configs';
import { ITemplate } from 'models';

import { uploadToStaticBucket } from './s3';

const addPrintContent = async (
  image: Jimp,
  content: InvitationTemplateContent,
  template: { width: number; height: number },
) => {
  const { source, properties, x, y } = content;
  // const { x, y } = getContentDimensions({ template, content });

  const font = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
  const width = Jimp.measureText(font, source);
  const height = Jimp.measureTextHeight(font, source, template.width);

  const textImage = new Jimp(width, height);
  await textImage.print(font, 0, 0, source);

  if (properties && properties.color) {
    console.log('Applying color', properties.color, Jimp.cssColorToHex(properties.color));
    await textImage.color([{ apply: 'xor', params: [properties.color] }]);
  }

  await textImage.writeAsync('text.png');
  await image.blit(textImage, x, y);
};

export const imageGenerator = async (template: ITemplate) => {
  const { width, height, contents, image } = template;

  const { w, h } = getImageDimensions(width, height);
  const imageInputPath = `${staticUrl}/${image}`;

  const jImage = await Jimp.read(imageInputPath);

  const textContents = contents.filter((c) => c.type === 'text');

  for (const c of textContents) {
    await addPrintContent(jImage, c, { ...template });
  }

  jImage.resize(w, h);
  jImage.quality(100);
  const imageName = `${v4()}.${jImage.getExtension()}`;
  // const imageOutPath = path.join(__dirname, '..', '..', 'uploads', 'invitations', imageName);
  // await jImage.writeAsync(imageOutPath);
  const imageBuffer = await jImage.getBufferAsync(Jimp.MIME_PNG);

  await uploadToStaticBucket(`invitations/${imageName}`, imageBuffer);

  return `invitations/${imageName}`;
};

const template: ITemplate = {
  id: '0ff1489e-8473-4d9b-a684-58f043b02d7e',
  name: 'Birthday template',
  height: 503,
  layout: 'portrait',
  width: 360,
  contents: [
    {
      id: 'a648bb11-bf3c-4e79-8530-a4254f9ef1ff',
      label: 'Message',
      source: 'Hello there My Friends, This should fill the entire width ot the image and should also be cropped.',
      x: 13,
      y: 410,
      properties: {},
      type: 'text',
      w: 100,
      h: 20,
    },
    {
      id: '95b13cd8-003f-4106-b1a2-48e7cc52dcee',
      label: 'Timing',
      source: '19th Frb, 2022',
      x: 14,
      y: 437,
      properties: {},
      type: 'text',
      w: 100,
      h: 20,
    },
    {
      id: '2007099e-e521-4694-ae83-4e78faa6f144',
      label: 'Venue',
      source: 'Blossom Cafe',
      x: 16,
      y: 463,
      properties: {},
      type: 'text',
      w: 100,
      h: 20,
    },
  ],
  image: 'templates/image-BABY-SHOWER-SAMP-2-INCOMPLETED-ebb67a26-bd51-4e27-b498-e74d78ff0202.png',
  type: 'image',
  event: 'birthday',
  thumbnail: 'templates/thumbnail-BABY-SHOWER-SAMP-2-COMPLETED-dbec56bd-346c-4449-825c-820b3d93d013.png',
};

// imageGenerator(template).then(console.log).catch(console.error);
