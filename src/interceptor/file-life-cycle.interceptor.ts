
import { Injectable, ExecutionContext, CallHandler } from '@nestjs/common';
import { Request, Response } from 'express';
import fs from "fs"
import path from 'path';
import { Observable } from 'rxjs';

@Injectable()
export class FileLifeCycleInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse<Response>();
    const request = context.switchToHttp().getRequest<Request>();
    const filePath = request.file?.path;

    if (filePath) {
      const deleteFile = () => {
        if (!fs.existsSync(path.dirname(filePath))) return;
        fs.rmSync(path.dirname(filePath), {
          recursive: true,
          force: true,
        });
      };

      response.on("finish", () => deleteFile())
      response.on("close", () => deleteFile())
      response.on("error", () => deleteFile())
    };

    return next.handle()
  }
}