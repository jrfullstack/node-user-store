import { compareSync, genSaltSync, hashSync } from 'bcryptjs';


// Ejemplo con metodos de objetos

export const bcryptAdapter = {

  hash: (password: string) => {
    const salt = genSaltSync();
    return hashSync(password, salt)
  },

  compare: (password:string, hashed: string) => {
    return compareSync(password, hashed);
  }

}