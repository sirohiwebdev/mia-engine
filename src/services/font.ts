import { InvitationTemplateContent } from '@sirohiwebdev/mia-core';
import * as textToImage from 'text-to-image';

import fonts from './fonts.json';

export const getImageFromText = async (text: InvitationTemplateContent) => {
  const { properties, w, h, source = '' } = text;
  const {
    fontFamily = 'Montserrat-Italic',
    fontSize = 12,
    color = 'black',
    backgroundColor = 'transparent',
  } = properties;
  const fontFile = fonts[fontFamily];

  const dataUri = await textToImage.generate(source, {
    // debug: true,
    maxWidth: w,
    fontSize,
    fontFamily,
    fontPath: `static/fonts/${fontFile}`,
    lineHeight: 1.5 * fontSize,
    // textAlign: 'center',
    verticalAlign: 'middle',
    margin: 2,
    textColor: color || 'black',
    bgColor: backgroundColor || 'transparent',
    // debugFilename: path.join('some', 'custom', 'path', 'to', 'debug_file.png'),
  });
  return dataUri;
};

// getImageFromText({
//   w: 200,
//   h: 200,
//   source: 'Very long text, for the template to render',
//   id: 'test',
//   type: 'text',
//   x: 20,
//   y: 30,
//   label: 'hello',
//   properties: {
//     fontSize: 0,
//     fontFamily: 'Montserrat-Italic',
//     fontWeight: 'bold',
//     fontStyle: 'italic',
//     color: 'red',
//     backgroundColor: 'transparent',
//   },
// })
//   .then(console.log)
//   .catch(console.error);
