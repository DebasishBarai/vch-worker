import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import * as fs from "fs";
import * as path from "path";

interface downloadVideoProps {
  key: string;
  editedVideoId: string;
  editedVideoFileType: string;
}

export const downloadVideo = async ({
  key,
  editedVideoId,
  editedVideoFileType,
}: downloadVideoProps) => {
  //@ts-ignore
  const client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  const outputDir = path.join(__dirname, "output"); // Path to output directory relative to current script location

  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  });

  try {
    // Ensure output directory exists, create if not
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const downloadPath = path.join(
      outputDir,
      `${editedVideoId}.${editedVideoFileType}`,
    );

    // Get the object from S3
    const response: any = await client.send(command);

    // Create a write stream to save the file
    const writer = fs.createWriteStream(downloadPath);

    // Pipe the response data to the write stream
    response.Body.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", () => {
        console.log("File downloaded successfully");
        resolve(downloadPath); // Resolve with the path where file is saved
      });

      writer.on("error", (error: any) => {
        console.error("Error writing file to disk:", error);
        reject(error);
      });
    });
  } catch (error) {
    console.error("Error downloading file:", error);
    throw error;
  }
};
