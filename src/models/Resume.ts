import mongoose, { Schema, Document, Types } from 'mongoose';

export type ResumeType = 'base' | 'tailored';

export interface IBullet {
  _id?: Types.ObjectId;
  text: string;
}

export interface IExperience {
  _id?: Types.ObjectId;
  company: string;
  role: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  bullets: IBullet[];
}

export interface IProject {
  _id?: Types.ObjectId;
  name: string;
  description?: string;
  link?: string;
  bullets: IBullet[];
}

export interface IEducation {
  _id?: Types.ObjectId;
  school: string;
  degree?: string;
  field?: string;
  startDate?: string;
  endDate?: string;
}

export interface ISkillGroup {
  category: string;
  items: string[];
}

export interface ILink {
  label?: string;
  url: string;
}

export interface IContact {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  links: ILink[];
}

export interface IResumeContent {
  contact: IContact;
  summary?: string;
  experiences: IExperience[];
  projects: IProject[];
  education: IEducation[];
  skills: ISkillGroup[];
}

export interface IResume extends Document {
  userId: Types.ObjectId;
  title: string;
  type: ResumeType;
  parentResumeId?: Types.ObjectId;
  jobId?: Types.ObjectId;
  content: IResumeContent;
  createdAt: Date;
  updatedAt: Date;
}

const BulletSchema = new Schema<IBullet>(
  { text: { type: String, required: true } },
  { _id: true }
);

const ExperienceSchema = new Schema<IExperience>(
  {
    company: { type: String, required: true },
    role: { type: String, required: true },
    location: String,
    startDate: String,
    endDate: String,
    current: { type: Boolean, default: false },
    bullets: { type: [BulletSchema], default: [] },
  },
  { _id: true }
);

const ProjectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true },
    description: String,
    link: String,
    bullets: { type: [BulletSchema], default: [] },
  },
  { _id: true }
);

const EducationSchema = new Schema<IEducation>(
  {
    school: { type: String, required: true },
    degree: String,
    field: String,
    startDate: String,
    endDate: String,
  },
  { _id: true }
);

const SkillGroupSchema = new Schema<ISkillGroup>(
  {
    category: { type: String, required: true },
    items: { type: [String], default: [] },
  },
  { _id: false }
);

const LinkSchema = new Schema<ILink>(
  {
    label: String,
    url: { type: String, required: true },
  },
  { _id: false }
);

const ContactSchema = new Schema<IContact>(
  {
    name: String,
    email: String,
    phone: String,
    location: String,
    links: { type: [LinkSchema], default: [] },
  },
  { _id: false }
);

const ResumeContentSchema = new Schema<IResumeContent>(
  {
    contact: { type: ContactSchema, default: () => ({ links: [] }) },
    summary: String,
    experiences: { type: [ExperienceSchema], default: [] },
    projects: { type: [ProjectSchema], default: [] },
    education: { type: [EducationSchema], default: [] },
    skills: { type: [SkillGroupSchema], default: [] },
  },
  { _id: false }
);

const ResumeSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ['base', 'tailored'],
      default: 'base',
      index: true,
    },
    parentResumeId: { type: Schema.Types.ObjectId, ref: 'Resume' },
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', index: true },
    content: { type: ResumeContentSchema, required: true, default: () => ({}) },
  },
  { timestamps: true }
);

ResumeSchema.index({ userId: 1, type: 1, updatedAt: -1 });

export default mongoose.models.Resume || mongoose.model<IResume>('Resume', ResumeSchema);
