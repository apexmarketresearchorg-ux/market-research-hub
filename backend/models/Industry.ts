import mongoose, { Schema, Document } from 'mongoose';

export interface IIndustry extends Document {
  name: string;
  description: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const IndustrySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Industry name is required'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    image: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IIndustry>('Industry', IndustrySchema);
