

export class CreateCategoryDto {
  
  private constructor(
    public readonly name: string,
    public readonly available: boolean,
  ){}

  static create(object:  {[key: string]: any}): [string?, CreateCategoryDto?] {


    const {name, available = false} = object;
    let availableBoolean = available;

    // Si el nombre no viene, mandamos un error por q es oblicagotio
    if (!name) return ['Missing name'];

    // si available entra es por que viene, vendra como string
    // y le asignamo el valor true a la variable
    if (typeof available !== 'boolean'){
      availableBoolean = (available === 'true')
    }

    return [undefined, new CreateCategoryDto(name, availableBoolean)];
  }
};
