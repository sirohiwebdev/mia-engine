import fs from 'fs';
const fonts = fs.readdirSync('static/fonts').sort();
const red = {};
fonts.forEach((f) => {
  const key = f.replace(/\.(TTF|OTF)/i, '');
  red[key] = f;
});

// fs.writeFileSync('src/services/fonts.json', JSON.stringify(red));
// fs.writeFileSync('src/services/font-names.json', JSON.stringify(Object.keys(red)));
