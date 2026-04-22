import mongoose, { Schema, Document } from 'mongoose';

export interface IJob extends Document {
  companyName: string;
  roleTitle: string;
  location?: string;
  status: 'wishlist' | 'applied' | 'interview' | 'offer' | 'rejected';
  jobDescription?: string;
  resumeUrl?: string; // Link to the specific tailored resume
  salaryRange?: string;
  notes?: string;
  createdAt: Date;
}

const JobSchema: Schema = new Schema({
  companyName: { type: String, required: true },
  roleTitle: { type: String, required: true },
  location: { type: String },
  status: { 
    type: String, 
    enum: ['wishlist', 'applied', 'interview', 'offer', 'rejected'], 
    default: 'wishlist' 
  },
  jobDescription: { type: String },
  resumeUrl: { type: String },
  salaryRange: { type: String },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Job || mongoose.model<IJob>('Job', JobSchema);