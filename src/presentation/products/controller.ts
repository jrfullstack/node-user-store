import { Request, Response } from "express";
import { CreateProductDto, CustomError, PaginationDto } from "../../domain";
import { ProductService } from "../services";


export class ProductsController {
  
  // DI
  constructor(
    private readonly productsService: ProductService
  ){}

  // Manejo de errores
  private handleError = (error: unknown, res: Response) => {
    if(error instanceof CustomError){
      return res.status(error.statusCode).json({error: error.message});
    }

    console.log(`${error}`);
    return res.status(500).json({error: 'Internal server error'})
  }

  createProduct = async(req: Request, res: Response) => {
    // como es un metodo estatico no se le pone el new
    const [error, createProductDto] = CreateProductDto.create({
      ...req.body,
      user: req.body.user.id
    });
    if(error) return res.status(400).json({error});

    this.productsService.createProduct(createProductDto!)
      .then(product => res.status(201).json(product))
      .catch(error => this.handleError(error, res));

    // res.json(' create products')

  };

  getProducts = async(req: Request, res: Response) => {

    // recogemos los query y asiganmos valores por defectos si no vienen
    const {page = 1, limit = 10} = req.query;

    // le pasamos al dto los 1uery convertidos en numeros
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if(error) return res.status(400).json({error});

    // res.json(' get products')

    this.productsService.getProducts(paginationDto!)
      .then(products => res.json(products))
      .catch(error => this.handleError(error, res));   

  };

  
};
 