"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadVideo = void 0;
const googleapis_1 = require("googleapis");
const fs = __importStar(require("fs"));
// Function toupload video to YouTube
const uploadVideo = ({ uploadFilePath, accessToken, refreshToken, creatorVideo, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const oauth2Client = new googleapis_1.google.auth.OAuth2();
        // Set the current access token
        oauth2Client.setCredentials({
            access_token: accessToken,
            refresh_token: refreshToken,
        });
        const youtube = googleapis_1.google.youtube({
            version: "v3",
            auth: oauth2Client,
        });
        const res = yield youtube.videos.insert({
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
    }
    catch (error) {
        console.error("Error uploading video:", error);
        throw error;
    }
});
exports.uploadVideo = uploadVideo;
