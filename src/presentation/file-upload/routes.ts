import { Router } from 'express';
import { FileUploadService } from '../services';
import { FileUploadController } from './controller';
import { FileUploadMiddleware, TypeMiddleware } from '../middlewares';




export class FileUploadRoutes {


  static get routes(): Router {

    const router = Router();
    
    const controller = new FileUploadController(
      new FileUploadService()
    );
    

    // Middleware para todas las rutas
    router.use(FileUploadMiddleware.containFiles);
    // router.use(TypeMiddleware.ValidTypes(['users', 'products', 'categories']));

    // Definir las rutas
    router.post('/single/:type', controller.uploadFile );
    router.post('/multiple/:type', controller.uploadMultipleFiles );



    return router;
  }


}

