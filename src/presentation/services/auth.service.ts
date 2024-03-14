

//* Validaciones y almacenamiento en la base de datos


import { JwtAdapter, bcryptAdapter, envs } from '../../config';
import { UserModel } from '../../data';
import { UserEntity, RegisterUserDto, CustomError, LoginUserDto } from '../../domain';
import { EmailService } from './email.service';


export class AuthService {

  // DI
  constructor(
    private readonly emailService: EmailService,
  ){}

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

      // Email de verificacion
      await this.sendEmailValidationLink(user.email);
      
      // Sacamos la password para q no la retorne al front
      const {password, ...userEntity} = UserEntity.fromObject(user);

      const token = await JwtAdapter.generateToken({id: user.id});
      if (!token) throw CustomError.internalServer('Error while creating JWT');

      return {
        user: userEntity,
        token,
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

  private sendEmailValidationLink = async(email: string) => {

    const token = await JwtAdapter.generateToken({email});
    if(!token) throw CustomError.internalServer('Error getting token');

    const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;

    const html = `
      <h1>Validate your email</h1>
      <p>Click on the following link to validate your email</p>
      <a href="${ link }">Validate your email: ${ email }</a>
    `;

    const options = {
      to: email,
      subject: 'Validate your email',
      htmlBody: html,
    }

    const isSent = await this.emailService.sendEmail(options);
    if ( !isSent ) throw CustomError.internalServer('Error sending email');

    return true;

  }

  public validateEmail = async(token: string) => {

    const payload = await JwtAdapter.validateToken(token);
    if (!payload) throw CustomError.unauthorized('Invalid token');
    
    const {email} = payload as {email: string};
    if(!email) throw CustomError.internalServer('Error not in token');

    const user = await UserModel.findOne({email});
    if(!user) throw CustomError.internalServer('Email not exist');

    user.emailValidated = true;
    await user.save();

    return true;

  }
  
};
