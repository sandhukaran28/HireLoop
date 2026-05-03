'use server';

import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/db';
import { getCurrentUserId } from '@/lib/auth';
import Job, { JobStatus } from '@/models/Job';

export type JobView = {
  _id: string;
  userId: string;
  companyName: string;
  roleTitle: string;
  location?: string;
  status: JobStatus;
  position: number;
  jobDescription?: string;
  applicationUrl?: string;
  salaryRange?: string;
  notes?: string;
  appliedAt?: string;
  createdAt: string;
  updatedAt: string;
};

const VALID_STATUSES: JobStatus[] = ['wishlist', 'applied', 'interview', 'offer', 'rejected'];

type LeanJob = {
  _id: unknown;
  userId: unknown;
  companyName: string;
  roleTitle: string;
  location?: string;
  status: JobStatus;
  position?: number;
  jobDescription?: string;
  applicationUrl?: string;
  salaryRange?: string;
  notes?: string;
  appliedAt?: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
};

function serializeJob(job: LeanJob): JobView {
  return {
    _id: String(job._id),
    userId: String(job.userId),
    companyName: job.companyName,
    roleTitle: job.roleTitle,
    location: job.location || undefined,
    status: job.status,
    position: job.position ?? 0,
    jobDescription: job.jobDescription || undefined,
    applicationUrl: job.applicationUrl || undefined,
    salaryRange: job.salaryRange || undefined,
    notes: job.notes || undefined,
    appliedAt: job.appliedAt ? new Date(job.appliedAt).toISOString() : undefined,
    createdAt: new Date(job.createdAt).toISOString(),
    updatedAt: new Date(job.updatedAt).toISOString(),
  };
}

function pickString(formData: FormData, key: string): string | undefined {
  const v = formData.get(key);
  if (typeof v !== 'string') return undefined;
  const trimmed = v.trim();
  return trimmed.length === 0 ? undefined : trimmed;
}

export async function getJobsForCurrentUser(): Promise<JobView[]> {
  await connectDB();
  const userId = await getCurrentUserId();
  const jobs = await Job.find({ userId })
    .sort({ status: 1, position: 1, createdAt: -1 })
    .lean();
  return jobs.map(serializeJob);
}

export async function createJob(formData: FormData) {
  await connectDB();
  const userId = await getCurrentUserId();

  const companyName = pickString(formData, 'companyName');
  const roleTitle = pickString(formData, 'roleTitle');
  if (!companyName || !roleTitle) {
    throw new Error('Company name and role title are required');
  }

  const rawStatus = pickString(formData, 'status') ?? 'wishlist';
  const status = (VALID_STATUSES.includes(rawStatus as JobStatus)
    ? rawStatus
    : 'wishlist') as JobStatus;

  const last = await Job.findOne({ userId, status }).sort({ position: -1 }).lean<{ position?: number } | null>();
  const position = (last?.position ?? -1) + 1;

  await Job.create({
    userId,
    companyName,
    roleTitle,
    status,
    position,
    location: pickString(formData, 'location'),
    jobDescription: pickString(formData, 'jobDescription'),
    applicationUrl: pickString(formData, 'applicationUrl'),
    salaryRange: pickString(formData, 'salaryRange'),
    notes: pickString(formData, 'notes'),
    appliedAt: status === 'applied' ? new Date() : undefined,
  });

  revalidatePath('/');
}

export async function updateJobStatus(jobId: string, status: JobStatus) {
  if (!VALID_STATUSES.includes(status)) {
    throw new Error(`Invalid status: ${status}`);
  }

  await connectDB();
  const userId = await getCurrentUserId();

  const last = await Job.findOne({ userId, status }).sort({ position: -1 }).lean<{ position?: number } | null>();
  const position = (last?.position ?? -1) + 1;

  const update: Record<string, unknown> = { status, position };
  if (status === 'applied') {
    update.appliedAt = new Date();
  }

  await Job.updateOne({ _id: jobId, userId }, { $set: update });
  revalidatePath('/');
}

export async function deleteJob(jobId: string) {
  await connectDB();
  const userId = await getCurrentUserId();
  await Job.deleteOne({ _id: jobId, userId });
  revalidatePath('/');
}
