import { getImageDimensions, InvitationTemplateContent } from '@sirohiwebdev/mia-core';
import Jimp from 'jimp';
import { v4 } from 'uuid';

import { staticUrl } from 'configs';
import { ITemplate } from 'models';
import { RootObject } from 'models/_base';

import { uploadToStaticBucket } from './s3';

const fontSizeMap = {
  8: Jimp.FONT_SANS_8_BLACK,
  10: Jimp.FONT_SANS_10_BLACK,
  12: Jimp.FONT_SANS_12_BLACK,
  14: Jimp.FONT_SANS_14_BLACK,
  16: Jimp.FONT_SANS_16_BLACK,
  32: Jimp.FONT_SANS_32_BLACK,
  64: Jimp.FONT_SANS_64_BLACK,
  128: Jimp.FONT_SANS_128_BLACK,
};

const getFont = (size: number) => {
  return fontSizeMap[size] || Jimp.FONT_SANS_12_BLACK;
};

const addPrintContent = async (
  image: Jimp,
  content: InvitationTemplateContent,
  template: { width: number; height: number },
) => {
  const { source, properties, x, y } = content;
  // const { x, y } = getContentDimensions({ template, content });

  const font = await Jimp.loadFont(getFont(properties.fontSize));
  const width = Jimp.measureText(font, source);
  const height = Jimp.measureTextHeight(font, source, template.width);

  const textImage = new Jimp(width, height);
  await textImage.print(font, 0, 0, source);

  if (properties && properties.color) {
    console.log('Applying color', properties.color, Jimp.cssColorToHex(properties.color));
    await textImage.color([{ apply: 'xor', params: [properties.color] }]);
  }

  // await textImage.writeAsync('text.png');
  await image.blit(textImage, x, y);
};

const addImageContent = async (image: Jimp, contents: InvitationTemplateContent[]) => {
  for (const content of contents) {
    const { source, x, y, w, h } = content;
    if (source) {
      const imageUpper = await Jimp.read(`${staticUrl}/${source}`);
      await imageUpper.resize(w, h);
      await image.blit(imageUpper, x, y);
    }
  }
};

export const imageGenerator = async (template: ITemplate) => {
  const { width, height, contents, image } = template;

  const { w, h } = getImageDimensions(width, height);
  const imageInputPath = `${staticUrl}/${image}`;

  const jImage = await Jimp.read(imageInputPath);

  const textContents = contents.filter((c) => c.type === 'text');
  const imageContents = contents.filter((c) => c.type === 'image');

  await addImageContent(jImage, imageContents);

  for (const c of textContents) {
    await addPrintContent(jImage, c, { ...template });
  }

  jImage.resize(w, h);
  jImage.quality(100);
  const imageName = `${v4()}.${jImage.getExtension()}`;
  const imageBuffer = await jImage.getBufferAsync(Jimp.MIME_PNG);

  await uploadToStaticBucket(`invitations/${imageName}`, imageBuffer);

  // await jImage.writeAsync(imageName);

  return `invitations/${imageName}`;
};

const template: Omit<ITemplate, keyof RootObject> = {
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
      properties: {
        color: 'pink',
      },
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
      properties: {
        color: 'green',
        fontSize: 32,
      },
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
      properties: {
        color: 'blue',
      },
      type: 'text',
      w: 100,
      h: 20,
    },
  ],
  image: 'templates/image-BABY-SHOWER-SAMPLE-5-INCOMPLETED-8fc55661-9abd-4998-9a9b-666c0cceb42b.png',
  type: 'image',
  event: 'birthday',
  thumbnail: 'templates/thumbnail-BABY-SHOWER-SAMP-2-COMPLETED-dbec56bd-346c-4449-825c-820b3d93d013.png',
};

// @ts-ignore
// imageGenerator(template).then(console.log).catch(console.error);
