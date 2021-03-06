import { Controller, Get, UploadedFile, Post, UseInterceptors, Sse, Request, Param} from '@nestjs/common';
import { AppService } from './app.service';
import {FileInterceptor} from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path = require('path');
import { interval, map, Observable, of } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { setEnvironmentData } from 'worker_threads';

import { EventsService } from './events.service';


@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly eventsService: EventsService
    ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test')
  async getTest(): Promise<any>{
    return this.appService.testUpdate()
  }

  @Post('test')
  async postTest(): Promise<any>{
    return this.appService.createBoxingPath()
  }

  @Get('search/:object')
  async searchObj(@Param('object') object:string): Promise<any> {
    return this.appService.searchObj(object)
  }


  @Post('image')
    @UseInterceptors(FileInterceptor('image',{
      storage: diskStorage({
        destination: './images',
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

    @Sse('events')
    events(
        @Request() req,
    ) {
        return this.eventsService.subscribe();
    }

//   @Sse('sse')
//   async sse(): Promise<any> {//Observable<MessageEvent>
//   let path = await this.appService.findBoxingPath()
//   return interval(1000).pipe(map((_) => ({ data: path })));
// }

}
