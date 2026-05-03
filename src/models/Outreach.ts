import mongoose, { Schema, Document, Types } from 'mongoose';

export type OutreachChannel = 'linkedin' | 'email' | 'other';
export type OutreachStatus = 'draft' | 'sent';

export interface IOutreach extends Document {
  userId: Types.ObjectId;
  jobId?: Types.ObjectId;
  recipientName: string;
  recipientRole?: string;
  recipientCompany?: string;
  channel: OutreachChannel;
  userContext?: string;
  generatedMessage: string;
  status: OutreachStatus;
  sentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OutreachSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', index: true },
    recipientName: { type: String, required: true },
    recipientRole: { type: String },
    recipientCompany: { type: String },
    channel: {
      type: String,
      enum: ['linkedin', 'email', 'other'],
      default: 'linkedin',
    },
    userContext: { type: String },
    generatedMessage: { type: String, required: true },
    status: {
      type: String,
      enum: ['draft', 'sent'],
      default: 'draft',
      index: true,
    },
    sentAt: { type: Date },
  },
  { timestamps: true }
);

OutreachSchema.index({ userId: 1, status: 1, updatedAt: -1 });

export default mongoose.models.Outreach || mongoose.model<IOutreach>('Outreach', OutreachSchema);
