"use strict";
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
const redis_1 = require("redis");
const downloader_1 = require("./downloader");
const uploader_1 = require("./uploader");
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let client = (0, redis_1.createClient)({
                url: process.env.REDIS_URL,
            });
            yield client.connect();
            console.log("Connected to Redis");
            while (true) {
                try {
                    const message = yield client.brPop("publish", 0);
                    const { key, accessToken, refreshToken, creatorVideo, editedVideoId, editedVideoFileType, } = JSON.parse(message.element);
                    console.log({
                        key,
                        accessToken,
                        refreshToken,
                        creatorVideo,
                        editedVideoId,
                        editedVideoFileType,
                    });
                    const downloadedFilePath = yield (0, downloader_1.downloadVideo)({
                        key,
                        editedVideoId,
                        editedVideoFileType,
                    });
                    console.log("File downloaded to:", downloadedFilePath);
                    const uploadResult = yield (0, uploader_1.uploadVideo)({
                        uploadFilePath: downloadedFilePath,
                        accessToken,
                        refreshToken,
                        creatorVideo,
                    });
                    console.log("Video uploaded to YouTube:", uploadResult);
                }
                catch (error) {
                    console.error("Video upload to YouTube error:", error);
                }
            }
        }
        catch (error) {
            console.error("Error:", error);
            console.error("Worker process exited with error");
        }
    });
}
init();
