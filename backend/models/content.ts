import mongoose, { Schema, Document } from 'mongoose';

export interface IContent extends Document {
  industryId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  type: 'document' | 'research' | 'report' | 'guide';
  fileUrl: string;
  fileSize: number;
  createdAt: Date;
  updatedAt: Date;
}

const ContentSchema: Schema = new Schema(
  {
    industryId: {
      type: Schema.Types.ObjectId,
      ref: 'Industry',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Content title is required'],
    },
    description: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      enum: ['document', 'research', 'report', 'guide'],
      default: 'document',
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IContent>('Content', ContentSchema);
