import { BadRequestException, UnauthorizedException } from "@nestjs/common";
import ffmpeg from "src/processors/ffmpeg";
import { CustomPreviewDto } from "./dto";
import path from "path"
import { helper, MediaDataTypes } from "./helper";
import { PassThrough } from "stream";

export class PreviewService {
    private validateFile(filePath: string): Promise<Partial<MediaDataTypes>> {
        return new Promise((resolve, reject) => {
            ffmpeg.ffprobe(filePath, (err, metadata) => {
                if (err) return reject(
                    new BadRequestException("Unable to access file metadata")
                );

                const format = metadata.format;

                if (!format.format_name) return reject(
                    new UnauthorizedException("Unable to identify file format")
                )

                const videoStream = metadata.streams.find(
                    (format) => format.codec_type === "video"
                );

                const audioStream = metadata.streams.find(
                    stream => stream.codec_type === "audio"
                );

                if (!videoStream) {
                    return reject(
                        new BadRequestException("Invalid video file")
                    )
                };

                return resolve({
                    name: path.basename(format.filename!),

                    codec: videoStream.codec_name,
                    width: videoStream.width,
                    height: videoStream.height,
                    fps: videoStream.r_frame_rate,
                    bitrate: videoStream.bit_rate,

                    audioCodec: audioStream?.codec_name,
                    audioChannels: audioStream?.channels,
                    audioSampleRate: audioStream?.sample_rate,

                    size: format.size,
                    duration: format.duration
                })
            })
        })
    }

    async transcode(filePath: string, dto: CustomPreviewDto) {
        const metadata = await this.validateFile(filePath);

        const font = path
            .join(process.cwd(), "fonts", `${dto.font}.ttf`)
            .replace(/\\/g, "/")
            .replace(/^([A-Za-z]):/, "$1\\:");

        const data = helper({
            ...metadata,
            scale: dto.ratio,
            grid: dto.grid
        });

        const { coordinates, scale } = data.coordinates;
        const vf: string[] = [];

        vf.push(`thumbnail=${data.thumbnailSize}`);

        vf.push(
            `scale=${scale}:force_original_aspect_ratio=decrease,pad=${scale}:(ow-iw)/2:(oh-ih)/2:black`
        );

        if (dto.timestamps) {

            vf.push(
                `drawtext=fontfile=${font}:text='%{eif\\:t/3600\\:d\\:2}\\:%{eif\\:(mod(t\\,3600))/60\\:d\\:2}\\:%{eif\\:mod(t\\,60)\\:d\\:2}':x=w-tw-10:y=h-th-10:fontsize=22:fontcolor=white`
            )
        };

        vf.push(`tile=${dto.grid}:padding=${dto.spacing}:margin=5:color=${dto.backgroundColor}`);

        if (dto.metadata) {
            const { y0, y1, y2, y3, textSize, spaceSize } = coordinates;

            vf.push(`pad=iw:ih+${spaceSize}:${dto.backgroundColor}`);

            const insert = (str: string, yPosition: number) => {
                vf.push(`drawtext=fontfile='${font}':text='${str}':x=5:y=${yPosition}:fontsize=${textSize}:fontcolor=${dto.textColor}`)
            };

            insert(`Name\\: ${data.name}`, y0);

            insert(`Video\\: ${data.videoCodec}, ${data.resolution}, ${data.fps} fps, ${data.size}, ${data.videoBitrate}`, y1);

            insert(`Audio\\: ${data.audioCodec}, ${data.audioChannels}, ${data.audioSampleRate}`, y2);

            insert(`Duration\\: ${data.duration}`, y3);
        }

        const formatConfig = {
            png: { codec: "png", options: [] },
            jpeg: { codec: "mjpeg", options: ["-q:v", "3"] },
            webp: { codec: "libwebp", options: ["-quality", "90"] }
        } as const;

        const stream = new PassThrough();
        const config = formatConfig[dto.outputFormat];

        ffmpeg(filePath)
            .outputOptions([
                "-vf", vf.join(","),
                "-frames:v", "1",
                "-f", "image2pipe",
                ...config.options
            ])
            .videoCodec(config.codec)
            .pipe(stream)

        return stream
    };

}