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
exports.downloadVideo = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const downloadVideo = ({ key, editedVideoId, editedVideoFileType, }) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const client = new client_s3_1.S3Client({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
    });
    const outputDir = path.join(__dirname, "output"); // Path to output directory relative to current script location
    const command = new client_s3_1.GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
    });
    try {
        // Ensure output directory exists, create if not
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        const downloadPath = path.join(outputDir, `${editedVideoId}.${editedVideoFileType}`);
        // Get the object from S3
        const response = yield client.send(command);
        // Create a write stream to save the file
        const writer = fs.createWriteStream(downloadPath);
        // Pipe the response data to the write stream
        response.Body.pipe(writer);
        return new Promise((resolve, reject) => {
            writer.on("finish", () => {
                console.log("File downloaded successfully");
                resolve(downloadPath); // Resolve with the path where file is saved
            });
            writer.on("error", (error) => {
                console.error("Error writing file to disk:", error);
                reject(error);
            });
        });
    }
    catch (error) {
        console.error("Error downloading file:", error);
        throw error;
    }
});
exports.downloadVideo = downloadVideo;
