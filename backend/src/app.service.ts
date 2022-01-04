import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ObjectID } from 'mongodb';
import Boxingpath from './entities/boxingpath.entity';
import Imagetextgps from './entities/imagetextgps.entity';
import { EventsService } from './events.service';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Imagetextgps)
    private  imagetextgpsRepository: Repository<Imagetextgps>,
    @InjectRepository(Boxingpath)
    private boxingpathRepository: Repository<Boxingpath>,

    private eventsService: EventsService
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async testUpdate(): Promise<any>{
    let boxing_path = await this.findBoxingPath()
    let id = new ObjectID('61d2b8c987f3e017d4eb3ae0')//boxing_path[0].id
    console.log(id)
    return  this.boxingpathRepository.update(
      { id: id }, //fix id
      { counter: Date.now()}
      );
  }

  async extractTextGPS(image_path : string): Promise<string>{
    const spawn =  await require("child_process").spawn;
    const pythonProcess =  await spawn('python', ["../Python/extract_text_gps.py", image_path])
    let mystr
    let myjson
    await pythonProcess.stdout.setEncoding('utf8');
    await pythonProcess.stdout.on('data', (data) => {
      //console.log(`Node JS got Data ${data} and type ${typeof(data)}`)
      mystr = data.toString();
      // console.log(mystr)

      myjson = JSON.parse(mystr);
      // console.log(myjson)
      let date = new Date();
      date.setMinutes(date.getMinutes()+7*60);
      myjson.date_saved = date
      this.imagetextgpsRepository.save(myjson)
      console.log("Data has already saved to database")

      this.eventsService.emit(myjson)

      // let id = new ObjectID('61d2b8c987f3e017d4eb3ae0')
      // return  this.boxingpathRepository.update(
      //   { id: id }, //fix id
      //   { counter: Date.now(),
      //     boxing_path: myjson.boxing_path
      //   },
        
      // );
    })

    
    pythonProcess.on('error', (error => console.log(`error: ${error.massge}`)))
    pythonProcess.on('close', (code) => {
    console.log(`child process close all stdio with code ${code}`);
    // send data to browser
    //res.send(dataToSend)
    });

    // await this.boxingpathRepository.update(
    //   { id: '61d2b8c987f3e017d4eb3ae0'}, //fix id
    //   { counter: Date.now()}
    //   );
    // console.log('updated')

    return mystr    
  }

  async findBoxingPath(): Promise<Boxingpath[]>{
    return this.boxingpathRepository.find()
  }

  async createBoxingPath(): Promise<Boxingpath>{
    return this.boxingpathRepository.save({
      "counter": 1,
      "boxing_path": ""
  })
  }
}
