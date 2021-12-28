import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async pythonCombine(): Promise<string>{
    const spawn =  await require("child_process").spawn;
      const pythonProcess =  await spawn('python', ["../Python/extract_text.py"])
      let mystr
      let myjson
      await pythonProcess.stdout.on('data', (data) => {
        console.log(`Node JS got Data ${data}`)
        mystr = data
        // mystr = data.toString();
        // console.log(mystr)

        // myjson = JSON.parse(mystr);
        // console.log(mystr)

      })
      
      await pythonProcess.on('error', (error => console.log(`error: ${error.massge}`)))
        pythonProcess.on('close', (code) => {
        console.log(`child process close all stdio with code ${code}`);
        // send data to browser
        //res.send(dataToSend)
        });
      await console.log(mystr)
      return mystr
  }
}
