// Imports your configured client and any necessary S3 commands.
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from './s3Client';
import fs from 'fs';

// Specifies a path within your Space and the file to upload.

// Uploads the specified file to the chosen path.
// filecontent => file path on local storage
// uploadPath => Upload path at cloud storage

export const uploadS3 = async (fileContent, uploadPath) => {
  if (!fileContent) {
    throw new Error('File name or file content is missing');
  }

  const bucketParams = {
    Bucket: process.env.BUCKET_NAME,
    Key: uploadPath,
    Body: fileContent,
  };
  try {
    console.log("bucketParams",bucketParams)
          // Uploading files to the bucket
          s3Client.upload(bucketParams, function (err, data) {
            if (err) {
              console.log("oh la la ");
            }
            console.log({
              status: true,
              msg: `File uploaded successfully. ${data.Location}`,
              url: data.Location,
            });
          });
        } catch (err) {
          console.log("S3 Upload Handler");
          console.log(err);
        }
  // try {
  //   const data = await s3Client.send(new PutObjectCommand(bucketParams));
  //   console.log(
  //     'Successfully uploaded object: ' +
  //       bucketParams.Bucket +
  //       '/' +
  //       bucketParams.Key
  //   );
  //   return data;
  // } catch (err) {
  //   console.log('Error in cloudUpload', err);
  // }
};
