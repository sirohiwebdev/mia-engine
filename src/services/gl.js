// Create context
var width = 64;
var height = 64;
// eslint-disable-next-line @typescript-eslint/no-var-requires
var mgl = require('gl');
console.log(mgl);
const gl = mgl(width, height, { preserveDrawingBuffer: true });

console.log(gl);

//Clear screen to red
gl.clearColor(1, 0, 0, 1);
gl.clear(gl.COLOR_BUFFER_BIT);

//Write output as a PPM formatted image
var pixels = new Uint8Array(width * height * 4);
gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
process.stdout.write(['P3\n# gl.ppm\n', width, ' ', height, '\n255\n'].join(''));

for (var i = 0; i < pixels.length; i += 4) {
  for (var j = 0; j < 3; ++j) {
    process.stdout.write(pixels[i + j] + ' ');
  }
}
