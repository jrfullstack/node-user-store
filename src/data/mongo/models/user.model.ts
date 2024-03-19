import mongoose from "mongoose";


const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: [true, 'Name is required'],
  },

  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },

  emailValidated: {
    type: Boolean,
    default: false,
  },

  password: {
    type: String,
    required: [true, 'Password is required'],
  },

  img: {
    type: String,
  },

  role: {
    type: [String],
    default: ['USER_ROLE'],
    enum: ['ADMIN_ROLE', 'USER_ROLE'],
  }

});

userSchema.set('toJSON', {
  // colocar el id del nuevo producto sin _id la barra baja
  virtuals: true,

  // quita el numero de versiones
  versionKey: false,

  // modifica los campos directos de mi modelo
  transform: function(doc, ret, options) {
    delete ret._id;
    delete ret.password;
  },

});

export const UserModel = mongoose.model('User', userSchema);