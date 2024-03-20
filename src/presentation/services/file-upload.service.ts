import { UploadedFile } from "express-fileupload";
import fs from "fs";
import path from "path";
import { Uuid } from "../../config";
import { CustomError } from "../../domain";


export class FileUploadService {

  constructor(
    private readonly uuid = Uuid.v4,
  ){}

  private checkFolder (folderPath: string){
    if(!fs.existsSync(folderPath)){
      fs.mkdirSync(folderPath)
    }
  }

  async uploadSingle(
  file: UploadedFile,
  folder: string = 'uploads',
  validExtensions: string[] = ['png', 'jpeg', 'jpg', 'webp', 'gif']
  ){

    try {
      
      // Para tomar la extension, lo cortamos del mimetype, si no viene nada que ponga un string vacio
      const fileExtension = file.mimetype.split('/').at(1) || '';

      // Validamos la extension del archivo
      if (!validExtensions.includes(fileExtension)) {
        throw CustomError.badRequest(`Invalid extension: ${fileExtension}, valid ones ${validExtensions}`)
      }

      // Donde quiero guardar el archivo, en la carpeta raiz el folder uploads
      const destination = path.resolve(__dirname, '../../../', folder);
      // Verificamos que el folder exista
      this.checkFolder(destination);
      // creamos un nombre unico del archivo
      const fileName = `${this.uuid()}.${fileExtension}`;

      // movemos el archivo y le asiganomos su nombre nuevo
      file.mv(`${destination}/${fileName}`)

      //* Almacenar en la base de datos

      // Retornamos el nombre del archivo, como objeto
      return {fileName};

    } catch (error) {
      console.log({error});      
    }

  }

  async uploadMuiltiple(
    files: UploadedFile[],
    folder: string = 'uploads',
    validExtensions: string[] = ['png', 'jpeg', 'jpg', 'webp', 'gif']
  ){

    const fileNames = await Promise.all(
      files.map(file => this.uploadSingle(file, folder, validExtensions))
    )

    return fileNames;
  }

   
};
