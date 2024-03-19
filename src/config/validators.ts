import mongoose from "mongoose";


export default class Validators {
  

  static isMongoID(id: string){
    return mongoose.isValidObjectId(id);
  }
};
