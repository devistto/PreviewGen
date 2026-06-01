import { BadRequestException, Body, Controller, Post, StreamableFile, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multer } from 'src/processors/multer';
import { AppService } from './app.service';
import { CustomPreviewDto } from './dto';
import { FileLifeCycleInterceptor } from 'src/interceptor/file-life-cycle.interceptor';

@Controller("api")
export class AppController {
    constructor(private mediaService: AppService) { }

    @Post("video")
    @UseInterceptors(FileLifeCycleInterceptor)
    @UseInterceptors(FileInterceptor("video", multer))
    async handler(
        @UploadedFile() video: Express.Multer.File,
        @Body() dto: CustomPreviewDto
    ) {
        if (!video?.path) throw new BadRequestException("File is missing");

        const stream = await this.mediaService.execute(video.path, dto);
        return new StreamableFile(stream, {
            type: "image/png",
            disposition: `inline; filename="output.${dto.outputFormat}"`,
        });
    }
}