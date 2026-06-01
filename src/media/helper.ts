import { filesize } from "filesize"
import path from "path";

export type MediaDataTypes = {
    name?: string;
    codec?: string;
    width?: number;
    height?: number;
    fps?: string;
    size?: any;
    grid?: string;
    duration?: number;
    bitrate?: string;
    scale?: string;
    audioCodec?: string;
    audioChannels?: number;
    audioSampleRate?: number
}

export const helper = ({
    name, codec, width, height, fps, size, duration, scale,
    bitrate, audioChannels, audioCodec, audioSampleRate, grid
}: MediaDataTypes) => {
    const data: Record<string, any> = {};

    const CHANNELS: Record<number, string> = {
        1: "1 channel (Mono)",
        2: "2 channels (Stereo)",
    };
    const ext = path.extname(name!);
    const base = path.basename(name!, ext);

    const cleanBase = base.normalize("NFKC")
        .replace(/[\r\n\t]/g, " ")
        .replace(/:/g, " - ")
        .replace(/["`']/g, "")
        .replace(/\[/g, "(")
        .replace(/\]/g, ")")
        .replace(/\{/g, "(")
        .replace(/\}/g, ")")
        .replace(/\//g, "-")
        .replace(/\\/g, "-")
        .replace(/%/g, " percent ")
        .replace(/\s+/g, " ")
        .trim();

    data.name = cleanBase + ext;

    data.videoCodec = codec?.toUpperCase() || "unknown";

    data.resolution = `${width || 0}x${height || 0}`;

    data.size = filesize(size);

    data.coordinates = getCols(scale || "16:9", grid || "4x4");

    data.fps = parseFps(fps);

    const seconds = Math.floor(Number(duration) || 0);

    data.duration = new Date(seconds * 1000)
        .toISOString()
        .substring(11, 19)
        .replaceAll(":", "\\:");

    data.videoBitrate = bitrate
        ? `${Math.round(Number(bitrate) / 1000)} Mbps`
        : "Unknown";

    data.audioCodec = audioCodec?.toUpperCase() || "unknown";
    data.audioSampleRate = audioSampleRate
        ? `${audioSampleRate} Hz`
        : "Unknown";

    data.audioChannels =
        CHANNELS[audioChannels || 0] ||
        `${audioChannels || 0}`;

    const [cols, rows] = grid!.split("x").map(Number);
    const cells = cols * rows;

    const totalFrames = Math.floor(Number(duration) * Number(parseFps(fps)));

    data.thumbnailSize = Math.max(
        1,
        Math.floor(totalFrames / cells)
    );


    return data
}

const parseFps = (fps?: string) => {
    if (!fps) return "0";
    const [num, den] = fps.split("/").map(Number);

    if (!num || !den) return "0";
    return Math.round(num / den).toString();
};

const getCols = (scale: string, grid: string) => {
    return {
        scale: SCALES[scale].scale,
        coordinates: SCALES[scale].coordinates[grid]
    }
}

const SCALES = {
    "16:9": {
        scale: "320:180",
        coordinates: {
            "2x2": { y0: 10, y1: 26, y2: 42, y3: 58, textSize: 11, spaceSize: "75:0:70" },
            "3x3": { y0: 12, y1: 35, y2: 58, y3: 81, textSize: 16, spaceSize: "105:0:100" },
            "4x4": { y0: 17, y1: 47, y2: 77, y3: 105, textSize: 22, spaceSize: "140:0:135" },
            "5x5": { y0: 15, y1: 52, y2: 90, y3: 128, textSize: 28, spaceSize: "160:0:155" }
        }
    },

    "4:3": {
        scale: "320:240",
        coordinates: {
            "2x2": { y0: 10, y1: 26, y2: 42, y3: 58, textSize: 11, spaceSize: "75:0:70" },
            "3x3": { y0: 12, y1: 35, y2: 58, y3: 81, textSize: 16, spaceSize: "105:0:100" },
            "4x4": { y0: 17, y1: 47, y2: 77, y3: 105, textSize: 22, spaceSize: "140:0:135" },
            "5x5": { y0: 15, y1: 52, y2: 90, y3: 128, textSize: 28, spaceSize: "160:0:155" }
        }
    },

    "1:1": {
        scale: "320:320",
        coordinates: {
            "2x2": { y0: 10, y1: 26, y2: 42, y3: 58, textSize: 11, spaceSize: "75:0:70" },
            "3x3": { y0: 12, y1: 35, y2: 58, y3: 81, textSize: 16, spaceSize: "105:0:100" },
            "4x4": { y0: 17, y1: 47, y2: 77, y3: 105, textSize: 22, spaceSize: "140:0:135" },
            "5x5": { y0: 15, y1: 52, y2: 90, y3: 128, textSize: 28, spaceSize: "160:0:155" }
        }
    },

    "9:16": {
        scale: "180:320",
        coordinates: {
            "2x2": { y0: 10, y1: 26, y2: 42, y3: 58, textSize: 11, spaceSize: "75:0:70" },
            "3x3": { y0: 12, y1: 35, y2: 58, y3: 81, textSize: 16, spaceSize: "105:0:100" },
            "4x4": { y0: 17, y1: 47, y2: 77, y3: 105, textSize: 22, spaceSize: "140:0:135" },
            "5x5": { y0: 15, y1: 52, y2: 90, y3: 128, textSize: 28, spaceSize: "160:0:155" }
        }
    }
} as const