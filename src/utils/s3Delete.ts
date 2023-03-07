import fs from 'fs';
import AWS from 'aws-sdk';
// import sharp from "sharp";

// Enter copied or downloaded access ID and secret key here
// const ID = "";
// const SECRET = "";
// const REGION = "";

// The name of the bucket that you have created
const BUCKET_NAME = process.env.BUCKET_NAME;
const s3 = new AWS.S3({
  endpoint: 'https://sgp1.digitaloceanspaces.com',
  region: 'us-east-1',
  accessKeyId: process.env.SPACES_KEY,
  secretAccessKey: process.env.SPACES_SECRET,
});

export default function s3Delete(uploadName) {
  return new Promise(function (resolve, reject) {

    // Setting up S3 upload parameters
    const params = {
      Bucket: BUCKET_NAME,
      Key: uploadName, // File name you want to save as in S3
    };
    try {
        console.log("deleteing ",uploadName)
      s3.deleteObject(params, function (err, data) {
        if (err) {console.log(err, err.stack); // error
        }

        console.log(data); // deleted
        resolve(data)
      });
    } catch (err) {
      console.log('Error', err);
      reject(err)
    }
  });
}
