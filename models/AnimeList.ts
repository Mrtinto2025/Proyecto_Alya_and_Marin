import mongoose, { Schema, model, models } from 'mongoose';

export interface IAnimeList extends Document {
  userId: mongoose.Types.ObjectId;
  animeId: string;
  status: 'watching' | 'completed' | 'plan-to-watch' | 'dropped' | 'on-hold';
  rating?: number;
  episodesWatched?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AnimeListSchema = new Schema<IAnimeList>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    animeId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['watching', 'completed', 'plan-to-watch', 'dropped', 'on-hold'],
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 10,
    },
    episodesWatched: {
      type: Number,
      default: 0,
      min: 0,
    },
    notes: {
      type: String,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  }
);

// Índice compuesto para evitar duplicados
AnimeListSchema.index({ userId: 1, animeId: 1 }, { unique: true });

const AnimeList = models.AnimeList || model<IAnimeList>('AnimeList', AnimeListSchema);

export default AnimeList;
