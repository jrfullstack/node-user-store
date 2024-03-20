import {v4 as uuidv4} from 'uuid';

export class Uuid {

  // Forma corta
  // static v4 = () => uuidv4();

  // forma normal
  static v4(){
    return uuidv4();
  }
  
};
