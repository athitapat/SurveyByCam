import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Imagetextgps from './entities/imagetextgps.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Imagetextgps)
    private  imagetextgpsRepository: Repository<Imagetextgps>
  ) {}

  getHello(): string {
    return 'Hello World!';
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
      console.log(mystr)

      myjson = JSON.parse(mystr);
      console.log(myjson)
      this.imagetextgpsRepository.save({'text': myjson.Data})
      console.log("Data has already saved to database")
    })

    
    await pythonProcess.on('error', (error => console.log(`error: ${error.massge}`)))
    pythonProcess.on('close', (code) => {
    console.log(`child process close all stdio with code ${code}`);
    // send data to browser
    //res.send(dataToSend)
    });
    return mystr

    // const { execFile } = require('child_process');
    // const child = execFile('python', ['../Python/extract_text.py'], (error, stdout, stderr) => {
    //   if (error) {
    //     throw error;
    //   }
    //   console.log(stdout);
    // });
      
  }
}
