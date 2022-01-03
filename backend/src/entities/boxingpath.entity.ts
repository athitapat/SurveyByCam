import { Entity, Column, ObjectIdColumn, ObjectID} from 'typeorm';

@Entity()
export class Boxingpath {
  @ObjectIdColumn()
  id?: ObjectID;
  @Column()
  counter: number;
  @Column()
  boxing_path: string;
}

export default Boxingpath;