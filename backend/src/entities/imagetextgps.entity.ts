import { Entity, Column, ObjectIdColumn, ObjectID} from 'typeorm';

@Entity()
export class Imagetextgps {
  @ObjectIdColumn()
  id?: ObjectID;
  @Column()
  image_path:string;
  @Column()
  boxing_path: string;
  @Column()
  dimension: string;
  @Column()
  position: Object;
  @Column()
  raw_text: string;
  @Column()
  texts: string;
  @Column()
  date_taken: Date;
  @Column()
  date_saved: Date;
}

export default Imagetextgps;