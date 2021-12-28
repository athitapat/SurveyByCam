import { Entity, Column, ObjectIdColumn, ObjectID} from 'typeorm';

@Entity()
export class Imagetextgps {
  @ObjectIdColumn()
  id?: ObjectID;

  @Column()
  text: string;
}

export default Imagetextgps;