import mongoose, { Schema, model, models } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  username: string;
  email: string;
  password: string;
  image?: string;
  role: 'user' | 'admin';
  bio?: string;
  favoriteAnime: string[];
  favoriteManga: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, 'El nombre de usuario es requerido'],
      unique: true,
      trim: true,
      minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
      maxlength: [20, 'El nombre no puede exceder 20 caracteres'],
    },
    email: {
      type: String,
      required: [true, 'El email es requerido'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Email inválido'],
    },
    password: {
      type: String,
      required: [true, 'La contraseña es requerida'],
      minlength: [8, 'La contraseña debe tener al menos 8 caracteres'],
    },
    image: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    bio: {
      type: String,
      maxlength: [500, 'La biografía no puede exceder 500 caracteres'],
    },
    favoriteAnime: [{
      type: String,
    }],
    favoriteManga: [{
      type: String,
    }],
  },
  {
    timestamps: true,
  }
);



const User = models.User || model<IUser>('User', UserSchema);

export default User;
