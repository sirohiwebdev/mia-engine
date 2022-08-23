import fs from 'fs';

import axios from 'axios';
import FormData from 'form-data';

interface ConvertToCaricatureRequest {
  script_key: string;
  message: string;
  status: number;
}

interface ImageDetailsResponse {
  data: {
    id: number;
    name: string; //  /media/loadding_photo_face/face_08212022185457/0.jpg.png
    photo: null | string;
    created_at: string;
    status: boolean;
  }[];
  message: string;
  status: number;
}

export class Caricature {
  caricatureApiHost = process.env.CARICATURE_API_HOST as string;

  private sendRequestForCaricature = async (image: Express.Multer.File) => {
    const url = new URL(this.caricatureApiHost);
    url.pathname = 'api/post-image';
    const formData = new FormData();
    console.log('Path to image --', image.path);
    console.log(fs.existsSync(image.path));
    formData.append('photo', fs.createReadStream(image.path));
    const { data } = await axios.post(url.toString(), formData, {
      timeout: 60000,
      headers: {
        ...formData.getHeaders(),
      },
    });

    return data as ConvertToCaricatureRequest;
  };

  private getImagePathFromKey = async (key: string) => {
    const url = new URL(this.caricatureApiHost);
    url.pathname = `api/get-image/${key}`;

    const { data } = await axios.get<ImageDetailsResponse>(url.toString());
    return data.data[0] && data.data[0].name;
  };

  generateCaricature = async (image: Express.Multer.File) => {
    const { script_key } = await this.sendRequestForCaricature(image);
    const imagePath = await this.getImagePathFromKey(script_key);

    const imageUrl = new URL(this.caricatureApiHost);
    imageUrl.pathname = imagePath;

    return imageUrl.toString();
  };
}
