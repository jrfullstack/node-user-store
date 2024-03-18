import { Request, Response } from "express";
import { CustomError, PaginationDto } from "../../domain";
import { CreateCategoryDto } from '../../domain/dtos/category/create-category.dto';
import { CategoryService } from '../services/category.service';


export class CategoryController {
  
  // DI
  constructor(
    private readonly categoryService: CategoryService
  ){}

  // Manejo de errores
  private handleError = (error: unknown, res: Response) => {
    if(error instanceof CustomError){
      return res.status(error.statusCode).json({error: error.message});
    }

    console.log(`${error}`);
    return res.status(500).json({error: 'Internal server error'})
  }

  createCategory = async(req: Request, res: Response) => {
    // como es un metodo estatico no se le pone el new
    const [error, createCategoryDto] = CreateCategoryDto.create(req.body);
    if(error) return res.status(400).json({error});

    this.categoryService.createCategory(createCategoryDto!, req.body.user)
      .then(category => res.status(201).json(category))
      .catch(error => this.handleError(error, res));

    // res.json(createCategoryDto);
  };

  getCategories = async(req: Request, res: Response) => {

    // recogemos los query y asiganmos valores por defectos si no vienen
    const {page = 1, limit = 10} = req.query;

    // le pasamos al dto los 1uery convertidos en numeros
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if(error) return res.status(400).json({error});

    // res.json(paginationDto)

    this.categoryService.getCategories(paginationDto!)
      .then(categories => res.json(categories))
      .catch(error => this.handleError(error, res));   

  };

  
};
 