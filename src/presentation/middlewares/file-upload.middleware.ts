import { NextFunction, Request, Response } from "express";



export class FileUploadMiddleware {

  static containFiles(req: Request, res: Response, next: NextFunction){

    // Si el archivo no viene o si no viene ningun objeto en el archivo
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({error: 'No files were selected'});      
    }

    // Si no es un arreglo lo convertimos a un arreglo y lo mandamo al body
    if( !Array.isArray(req.files.file) ){
      req.body.files = [req.files.file];
    } else {
      // pero si es un arreglo lo mandamo igual al body
      req.body.files = req.files.file;
    }

    next();
  }
  
};
