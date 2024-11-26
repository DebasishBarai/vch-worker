import { google } from "googleapis";
import * as fs from "fs";

interface uploadVideoProps {
  uploadFilePath: string;
  accessToken: string;
  refreshToken: string;
  creatorVideo: any;
}
// Function toupload video to YouTube
export const uploadVideo = async ({
  uploadFilePath,
  accessToken,
  refreshToken,
  creatorVideo,
}: uploadVideoProps) => {
  try {
    const oauth2Client = new google.auth.OAuth2();
    // Set the current access token
    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    const youtube = google.youtube({
      version: "v3",
      auth: oauth2Client,
    });

    console.log({ accessToken, refreshToken });

    const res: any = await youtube.videos.insert({
      part: ["snippet", "status"],
      requestBody: {
        snippet: {
          title: creatorVideo.title,
          description: creatorVideo.description,
        },
        status: {
          privacyStatus: creatorVideo.privacyStatus, // Change privacy status as needed
        },
      },
      media: {
        body: fs.createReadStream(uploadFilePath),
      },
    });

    console.log("Video uploaded successfully:", res.data);

    return res.data;
  } catch (error) {
    console.error("Error uploading video:", error);
    throw error;
  }
};
