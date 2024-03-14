

//* Validaciones y almacenamiento en la base de datos


import { JwtAdapter, bcryptAdapter } from '../../config';
import { UserModel } from '../../data';
import { UserEntity, RegisterUserDto, CustomError, LoginUserDto } from '../../domain';


export class AuthService {

  // DI
  constructor(){}

  public async registerUser(registerUserDto: RegisterUserDto){

    const existUser = await UserModel.findOne({email: registerUserDto.email});
    if(existUser) throw CustomError.badRequest('Email already exist');

    try {
      // Preparamos el modelo a guardar
      const user = new UserModel(registerUserDto);

      // Encriptamos la contrasena
      user.password = bcryptAdapter.hash(registerUserDto.password);

      // Guardamos el usurio
      await user.save();
      
      // Sacamos la password para q no la retorne al front
      const {password, ...userEntity} = UserEntity.fromObject(user)

      return {
        user: userEntity,
        token: 'ABC'
      };
      
    } catch (error) {
      throw CustomError.internalServer(`${error}`)
      
    }
  }


  public async loginUser(loginUserDto: LoginUserDto){

    // Verificar que existe el usuario
    const user = await UserModel.findOne({email: loginUserDto.email});
    if(!user) throw CustomError.badRequest('User with that email or password not exist');

    // Comparar contrasenias
    const isMatching = bcryptAdapter.compare(loginUserDto.password, user.password);    
    if(!isMatching) throw CustomError.badRequest('Incorrect password!');

    const {password, ...userEntity} = UserEntity.fromObject(user);

    const token = await JwtAdapter.generateToken({id: user.id, email: user.email});
    if (!token) throw CustomError.internalServer('Error while creating JWT');
    
    return {
      user: userEntity,
      token,
    }
    
  }
  
};
