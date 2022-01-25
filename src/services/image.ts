const rW = 1247;
export const getImageDimensions = (width: number, height: number) => {
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
