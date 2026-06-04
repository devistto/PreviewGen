import { BadRequestException } from "@nestjs/common";
import { diskStorage } from "multer"
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import { randomInt } from "crypto"
import path from "path";
import fs from "fs"

export const VIDEO_MIMETYPES = ["video/3gpp", "video/3gpp2", "video/h261", "video/h263", "video/h264", "video/iso.segment", "video/jpeg", "video/jpm", "video/mj2", "video/mp2t", "video/mp4", "video/mpeg", "video/ogg", "video/quicktime", "video/vnd.dece.hd", "video/vnd.dece.mobile", "video/vnd.dece.mp4", "video/vnd.dece.pd", "video/vnd.dece.sd", "video/vnd.dece.video", "video/vnd.directv.mpeg", "video/vnd.directv.mpeg-tts", "video/vnd.dlna.mpeg-tts", "video/vnd.dvb.file", "video/vnd.fvt", "video/vnd.mpegurl", "video/vnd.ms-playready.media.pyv", "video/vnd.radgamettools.bink", "video/vnd.radgamettools.smacker", "video/vnd.sealed.mpeg1", "video/vnd.sealed.mpeg4", "video/vnd.sealed.swf", "video/vnd.sealedmedia.softseal.mov", "video/vnd.uvvu.mp4", "video/vnd.youtube.yt", "video/vivo", "video/webm", "video/x-f4v", "video/x-fli", "video/x-flv", "video/x-m4v", "video/x-matroska", "video/x-mng", "video/x-ms-asf", "video/x-ms-vob", "video/x-ms-wm", "video/x-ms-wmv", "video/x-ms-wmx", "video/x-ms-wvx", "video/x-msvideo", "video/x-sgi-movie", "video/x-smv"];

export const multer: MulterOptions = {
    storage: diskStorage({
        destination(req, file, callback) {
            const folder = path.join(
                process.cwd(),
                "uploads",
                randomInt(1000000).toString()
            );

            fs.mkdirSync(folder, { recursive: true });
            callback(null, folder);
        },
        filename(req, file, callback) {
            const fixedName = `${file.originalname}`
            callback(null, fixedName);
        },
    }),
    fileFilter(req, file, callback) {
        if (!VIDEO_MIMETYPES.includes(file.mimetype)) {
            const message = `Acceptable values are: ${VIDEO_MIMETYPES}`
            callback(new BadRequestException(message), false)
        };
        callback(null, true)
    }
}