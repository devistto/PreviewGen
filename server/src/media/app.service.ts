import { Injectable } from "@nestjs/common";
import { CustomPreviewDto } from "./dto";
import { PreviewService } from "./preview.service";

@Injectable()
export class AppService {
    constructor(private previewService: PreviewService) { }

    async execute(videoPath: string, dto: CustomPreviewDto) {
        return this.previewService.transcode(videoPath, dto);
    }
}