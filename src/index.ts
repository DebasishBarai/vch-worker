import { createClient } from "redis";
import { downloadVideo } from "./downloader";
import { uploadVideo } from "./uploader";

async function init() {
  try {
    let client = createClient({
      url: process.env.REDIS_URL,
    });
    await client.connect();
    console.log("Connected to Redis");

    while (true) {
      const message: any = await client.brPop("publish", 0);
      const {
        key,
        accessToken,
        refreshToken,
        creatorVideo,
        editedVideoId,
        editedVideoFileType,
      } = JSON.parse(message.element);
      console.log({
        key,
        accessToken,
        refreshToken,
        creatorVideo,
        editedVideoId,
        editedVideoFileType,
      });
      const downloadedFilePath: string | any = await downloadVideo({
        key,
        editedVideoId,
        editedVideoFileType,
      });
      console.log("File downloaded to:", downloadedFilePath);

      const uploadResult = await uploadVideo({
        uploadFilePath: downloadedFilePath,
        accessToken,
        refreshToken,
        creatorVideo,
      });
      console.log("Video uploaded to YouTube:", uploadResult);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

init();
