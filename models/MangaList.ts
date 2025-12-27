import mongoose, { Schema, model, models } from 'mongoose';

export interface IMangaList extends Document {
  userId: mongoose.Types.ObjectId;
  mangaId: string;
  status: 'reading' | 'completed' | 'plan-to-read' | 'dropped' | 'on-hold';
  rating?: number;
  chaptersRead?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MangaListSchema = new Schema<IMangaList>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    mangaId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['reading', 'completed', 'plan-to-read', 'dropped', 'on-hold'],
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 10,
    },
    chaptersRead: {
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
MangaListSchema.index({ userId: 1, mangaId: 1 }, { unique: true });

const MangaList = models.MangaList || model<IMangaList>('MangaList', MangaListSchema);

export default MangaList;
