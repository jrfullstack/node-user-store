import { Router } from 'express';
import { CategoryController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { CategoryService } from '../services';




export class CategoryRoutes {


  static get routes(): Router {

    const router = Router();
    const categoryService = new CategoryService();
    const controller = new CategoryController(categoryService);
    
    // Definir las rutas
    router.get('/', controller.getCategories );
    // Validamos que venga el toquen para poder crear una categoria nueva
    router.post('/',[AuthMiddleware.validateJWT], controller.createCategory );



    return router;
  }


}

