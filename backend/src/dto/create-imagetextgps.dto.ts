import { IsInt , IsNotEmpty , IsBoolean , IsDate , IsString , IsArray} from "class-validator";
import {ObjectID} from 'mongodb';


export class CreateImageTextGPSDto{
    @IsString()
    image_path:string;
    @IsString()
    boxing_path: string;

    dimension: string;

    @IsString()
    raw_text: string;

    texts: string;

    date_taken: Date;

    date_saved: Date;

}

