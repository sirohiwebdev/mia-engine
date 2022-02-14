import { S3Client, S3 } from '@aws-sdk/client-s3';
import { Upload, Options } from '@aws-sdk/lib-storage';

import { S3_STORAGE_BUCKET } from 'configs';

const uploadToS3 = async (target: { Bucket: string; Key: string; Body: Options['params']['Body'] }) => {
  try {
    const parallelUploads3 = new Upload({
      client: new S3({}) || new S3Client({}),
      tags: [], // optional tags
      leavePartsOnError: false, // optional manually handle dropped parts
      params: { ...target, CacheControl: 'public, max-age=14400' },
    });

    parallelUploads3.on('httpUploadProgress', (progress) => {
      console.log(progress);
    });

    await parallelUploads3.done();

    return true;
  } catch (e) {
    console.log('Error during s3 upload');
    console.error(e);
    return false;
  }
};

export const uploadToStaticBucket = async (Key: string, Body: Options['params']['Body']) => {
  return await uploadToS3({ Bucket: S3_STORAGE_BUCKET, Key, Body });
};
