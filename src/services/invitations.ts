import { getImageDimensions, InvitationTemplateContent } from '@sirohiwebdev/mia-core';
import Jimp from 'jimp';
import { v4 } from 'uuid';

import { staticUrl } from 'configs';
import { ITemplate } from 'models';
import { RootObject } from 'models/_base';

import { getImageFromText } from './font';
import { uploadToStaticBucket } from './s3';

const addPrintContent = async (
  image: Jimp,
  content: InvitationTemplateContent,
  template: { width: number; height: number },
) => {
  const { source = '', properties, x, y } = content;

  const textImageUri = await getImageFromText(content);

  const buffer = Buffer.from(textImageUri.replace('data:image/png;base64,', ''), 'base64');

  const textImage = await Jimp.read(buffer);
  await image.blit(textImage, x, y);
};

const addImageContent = async (image: Jimp, contents: InvitationTemplateContent[]) => {
  for (const content of contents) {
    const { source, x, y, w, h } = content;
    if (source) {
      const sourcePath = source.startsWith('http') ? source : `${staticUrl}/${source}`;
      const imageUpper = await Jimp.read(sourcePath);
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
  const caricatureContents = contents.filter((c) => c.type === 'caricature');

  await addImageContent(jImage, imageContents);
  await addImageContent(jImage, caricatureContents);

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
      source: 'Hello there My Friends',
      x: 13,
      y: 410,
      properties: {
        color: 'black',
      },
      type: 'text',
      w: 200,
      h: 20,
    },
    {
      id: '95b13cd8-003f-4106-b1a2-48e7cc52dcee',
      label: 'Timing',
      source: '19th Feb, 2022',
      x: 14,
      y: 437,
      properties: {
        color: 'green',
        fontSize: 14,
      },
      type: 'text',
      w: 200,
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
