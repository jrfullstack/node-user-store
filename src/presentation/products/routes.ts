import { Router } from 'express';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { ProductsController } from './controller';
import { ProductService } from '../services';





export class ProductsRoutes {


  static get routes(): Router {

    const router = Router();
    const productService = new ProductService();
    const controller = new ProductsController(productService);
    
    // Definir las rutas
    router.get('/', controller.getProducts );
    // Validamos que venga el toquen para poder crear una categoria nueva
    router.post('/',[AuthMiddleware.validateJWT], controller.createProduct );



    return router;
  }


}

