import mongoose, { Schema } from "mongoose";


const categorySchema = new mongoose.Schema({

  name: {
    type: String,
    required: [true, 'Name is required'],
    unique: true,

  },

  available: {
    type: Boolean,
    default: false,

  },

  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    
  }

});

categorySchema.set('toJSON', {
  // colocar el id del nuevo producto sin _id la barra baja
  virtuals: true,

  // quita el numero de versiones
  versionKey: false,

  // modifica los campos directos de mi modelo
  transform: function(doc, ret, options) {
    delete ret._id;
  },

})

export const CategoryModel = mongoose.model('Category', categorySchema);