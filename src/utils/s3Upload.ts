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

export default function S3Upload(fileContent, uploadName,key) {
  return new Promise(function (resolve, reject) {


    // Setting up S3 upload parameters
    const params = {
      Bucket: BUCKET_NAME,
      Key: uploadName, // File name you want to save as in S3
      Body: fileContent,
    };

    try {
      // Uploading files to the bucket
      s3.upload(params, function (err, data) {
        if (err) {
          console.log("oh la la ");
          reject(err);
        }
        console.log(data)
        if(data){
        resolve({
          status: true,
          msg: `File uploaded successfully. ${data.Location}`,
          key,
          url: data.key,
          uploadPath: data.key,
        });
      }else{
        
      reject("Something went wrong, Try again later")
      }
      });
    } catch (err) {
      console.log("S3 Upload Handler");
      console.log(err);
      reject(err)
    }
  });
}
