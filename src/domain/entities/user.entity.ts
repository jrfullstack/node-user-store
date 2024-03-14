
//* Valida la estructura del dato esperado
//* Una vez guardado en la base de datos es lo que se le envia al front en la respuesta

import { CustomError } from "../errors/custom.error";


export class UserEntity {

  constructor(
    public id: string,
    public name: string,
    public email: string,
    public emailValidated: string,
    public password: string,
    public role: string[],
    public img?: string,
  ){}

  static fromObject(object: {[key:string]:any } ) {
    const {id, _id, name, email, emailValidated, password, role, img} = object;

    if(!id && !_id) throw CustomError.badRequest('Missing id');
    if(!name) throw CustomError.badRequest('Missing name');
    if(!email) throw CustomError.badRequest('Missing email');
    if(emailValidated === undefined) throw CustomError.badRequest('Missing emailValidated');
    if(!password) throw CustomError.badRequest('Missing password');
    if(!role) throw CustomError.badRequest('Missing role');

    return new UserEntity(id || _id, name, email, emailValidated, password, role, img);

  }
}