import { InvitationVideoTemplateParams, VideoTemplateContent } from '@sirohiwebdev/mia-core';
import { FFVideo, FFScene, FFImage, FFText, FFCreator } from 'ffcreatorlite';

class VideoMaker {
  creator: FFCreator;
  scene: FFScene;
  template: InvitationVideoTemplateParams;

  constructor(data: InvitationVideoTemplateParams) {
    this.template = data;
    const videoPath = `/home/sirohi/work/strivebit/mia/mia-backend/src/services/${this.template.video}`;
    // this.video = ffmpeg(videoPath);
    this.scene = new FFScene();
    this.creator = new FFCreator({
      outputDir: './output',
      // cacheDir: './cache',
      // width: data.width,
      // height: data.height,
      output: 'output.mp4',
    });

    this.creator.on('start', () => {
      console.log(`FFCreator start`);
    });

    this.creator.on('progress', (e) => {
      // @ts-ignore
      console.log(`FFCreator progress: ${e.state} ${(e.percent * 100) >> 0}%`);
    });
    const video = new FFVideo({
      path: videoPath,
      // x: 100,
      // y: 150,
      // width: 500,
      // height: 350,
    });
    video.setAudio(true); // Is there music
    // console.log(video);
    this.scene.addChild(video);
  }

  addContents = () => {
    const contents = this.template.contents.filter((x) => x.type === 'text');
    contents.forEach((content) => {
      // const { source, x, y, w, h, properties, start, end } = content;
      // return {
      //   options: {
      //     fontfile: 'awb.ttf',
      //     text: source,
      //     fontsize: properties.fontSize || 60,
      //     fontcolor: properties.color || 'black',
      //     x,
      //     y,
      //     enable: `between(t,${start},${end})`,
      //   },
      //   filter: 'drawtext',
      // };
      this.addText(content);
    });

    // this.video.videoFilters(filters);
  };

  // save = (filePath: string, onSave: (event: any) => void) => {
  //   this.video.output(filePath).on('progress', console.log).on('end', onSave);
  // };

  run = () => {
    // this.video.run();
    this.creator.addChild(this.scene);
    this.creator.start(); // start processing
    this.creator.on('complete', (e) => {
      console.log(`FFCreator completed: \n USEAGE: ${e.useage} \n PATH: ${e.output} `);
    });
    this.creator.on('error', (e) => {
      console.error(e);
      // console.log(`FFCreator completed: \n USEAGE: ${e.useage} \n PATH: ${e.output} `);
    });
  };

  addText = (textContent: VideoTemplateContent) => {
    const text = new FFText({ text: textContent.source, x: textContent.x, y: textContent.y });
    text.setColor(textContent.properties?.color || 'black'); // text color
    // text.setBackgroundColor('#b33771'); // background color
    // text.addEffect('fadeInDown', 1, 1); // Animation
    console.log(text);
    this.scene.addChild(text);
  };
}

export default VideoMaker;

const template: InvitationVideoTemplateParams = {
  id: '0ff1489e-8473-4d9b-a684-58f043b02d7e',
  name: 'Birthday template',
  height: 503,
  layout: 'portrait',
  width: 360,
  contents: [
    {
      id: 'a648bb11-bf3c-4e79-8530-a4254f9ef1ff',
      label: 'Message',
      source: 'John and Sujan \n Getting married on \n 27th March, 2022',
      x: 553,
      y: 410,
      start: 15,
      end: 20,
      properties: {
        color: 'black',
      },
      type: 'text',
      w: 100,
      h: 20,
    },
  ],
  video: 'empty-video.mp4',
};

const vm = new VideoMaker(template);

vm.addContents();
// vm.save('output.mp4', (e) => console.log(e));
vm.run();
