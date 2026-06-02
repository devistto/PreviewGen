import "dotenv/config"
import ffmpeg from "fluent-ffmpeg"

const isProduction = process.env.NODE_ENV === "production";
const ffmpegPath = isProduction
    ? "ffmpeg"
    : require("ffmpeg-static") as string

const ffprobePath = isProduction
    ? "ffprobe"
    : require("ffprobe-static").path

ffmpeg.setFfmpegPath(ffmpegPath)
ffmpeg.setFfprobePath(ffprobePath)

export default ffmpeg