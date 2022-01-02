import { Controller, Get, UploadedFile, Post, UseInterceptors} from '@nestjs/common';
import { AppService } from './app.service';
import {FileInterceptor} from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path = require('path');
import { Observable, of } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';



@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test')
  async getTest(): Promise<string>{
    return this.appService.extractTextGPS("test")
  }

  @Post('image')
    @UseInterceptors(FileInterceptor('image',{
      storage: diskStorage({
        destination: '../Images',
        filename: (req, file, cb) =>{
          const filename: string = path.parse(file.originalname).name.replace(/\s/g, '')+ '-' + Date.now();
          const extension:string = path.parse(file.originalname).ext;

          cb(null, `${filename}${extension}`)
        }
      })
    }))

    uploadImage(@UploadedFile() file) {
      console.log(file);
      const res =  this.appService.extractTextGPS(file.path);
      return of({"image_path": file.path});
    }
}
