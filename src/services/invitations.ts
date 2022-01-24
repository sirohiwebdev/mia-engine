import path from 'path';

import { IInvitationTemplateData, InvitationTemplateContent } from '@sirohiwebdev/mia-core';
import Jimp from 'jimp';
import { v4 } from 'uuid';
const rW = 399;

const addPrintContent = async (
  image: Jimp,
  content: InvitationTemplateContent,
  template: { width: number; height: number },
) => {
  const { source } = content;
  const { x, y } = getContentDimensions({ template, content });

  const font = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
  await image.print(font, x, y, source);
};

const getImageDimensions = (width: number, height: number) => {
  const [landscape, ratio] = [width > height, width / height]; // true means landscape;
  const rH = Math.round(rW / ratio);

  return {
    w: rW,
    h: rH,
    landscape,
    ratio,
  };
};
export const getContentDimensions = ({
  template,
  content,
}: {
  template: { width: number; height: number };
  content: { x: number; y: number; w: number; h: number };
}) => {
  const tDimensions = getImageDimensions(template.width, template.height);
  console.log('template', template);
  console.log('Dimensions', tDimensions);
  const xScale = tDimensions.w / template.width;
  const yScale = tDimensions.h / template.height;
  console.log(xScale, yScale);

  const newW = Math.fround(xScale * content.w);
  const newH = Math.fround(yScale * content.h);
  const newX = Math.fround(xScale * content.x);
  const newY = Math.fround(xScale * content.y);

  console.log('old x', content.x, 'nex', newX);
  console.log('old y', content.y, 'ney', newY);
  console.log('old w', content.w, 'new', newW);
  console.log('old h', content.h, 'neh', newH);

  return {
    x: newX,
    y: newY,
    h: newH,
    w: newW,
  };
};
export const imageGenerator = async (template: IInvitationTemplateData & { image: string }) => {
  const { width, height, contents, image } = template;

  const { w, h } = getImageDimensions(width, height);

  const jImage = await Jimp.read(image);
  await jImage.resize(w, h);

  const textContents = contents.filter((c) => c.type === 'text');

  for (const c of textContents) {
    await addPrintContent(jImage, c, { ...template });
  }

  const imageName = `${v4()}.${jImage.getExtension()}`;
  const imageOutPath = path.join(__dirname, '..', '..', 'uploads', 'invitations', imageName);
  await jImage.writeAsync(imageOutPath);

  return imageName;
};
