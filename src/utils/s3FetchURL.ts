import fs from "fs";
import AWS from "aws-sdk";
// import sharp from "sharp";

// Enter copied or downloaded access ID and secret key here
// const ID = "";
// const SECRET = "";
// const REGION = "";

// The name of the bucket that you have created
const BUCKET_NAME = process.env.BUCKET_NAME;
const s3 = new AWS.S3({
    endpoint: "https://sgp1.digitaloceanspaces.com",
    region: "us-east-1",
    accessKeyId: process.env.SPACES_KEY,
    secretAccessKey: process.env.SPACES_SECRET
});

export default function s3FetchURL(uploadName) {
  return new Promise(function (resolve, reject) {

    const signedUrlExpireSeconds = 60 * 5

    // Setting up S3 upload parameters
    const params = {
      Bucket: BUCKET_NAME,
      Key: uploadName, // File name you want to save as in S3
      Expires: signedUrlExpireSeconds,
    };
    try {
      // Uploading files to the bucket
      const url = s3.getSignedUrl('getObject', params)
      resolve(url)
    } catch (err) {
      console.log("S3 signedURL Handler");
      console.log(err);
      reject(err)
    }
  });
}
