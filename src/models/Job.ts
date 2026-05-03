import mongoose, { Schema, Document, Types } from 'mongoose';

export type JobStatus = 'wishlist' | 'applied' | 'interview' | 'offer' | 'rejected';

export interface IJob extends Document {
  userId: Types.ObjectId;
  companyName: string;
  roleTitle: string;
  location?: string;
  status: JobStatus;
  position: number;
  jobDescription?: string;
  applicationUrl?: string;
  salaryRange?: string;
  notes?: string;
  appliedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    companyName: { type: String, required: true },
    roleTitle: { type: String, required: true },
    location: { type: String },
    status: {
      type: String,
      enum: ['wishlist', 'applied', 'interview', 'offer', 'rejected'],
      default: 'wishlist',
      index: true,
    },
    position: { type: Number, default: 0 },
    jobDescription: { type: String },
    applicationUrl: { type: String },
    salaryRange: { type: String },
    notes: { type: String },
    appliedAt: { type: Date },
  },
  { timestamps: true }
);

JobSchema.index({ userId: 1, status: 1, position: 1 });

export default mongoose.models.Job || mongoose.model<IJob>('Job', JobSchema);
