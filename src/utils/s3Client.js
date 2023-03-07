import { S3 } from "@aws-sdk/client-s3";

const s3Client = new S3({
    endpoint: "https://sgp1.digitaloceanspaces.com",
    region: "us-east-1",
    accessKeyId: process.env.SPACES_KEY,
    secretAccessKey: process.env.SPACES_SECRET
});

export { s3Client };