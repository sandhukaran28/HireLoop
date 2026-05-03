'use client';

import { useTransition } from 'react';
import { Trash2, ExternalLink } from 'lucide-react';
import { deleteJob, updateJobStatus, type JobView } from '@/lib/actions/jobs';
import type { JobStatus } from '@/models/Job';

const STATUS_OPTIONS: { value: JobStatus; label: string }[] = [
  { value: 'wishlist', label: 'Wishlist' },
  { value: 'applied', label: 'Applied' },
  { value: 'interview', label: 'Interview' },
  { value: 'offer', label: 'Offer' },
  { value: 'rejected', label: 'Rejected' },
];

export default function JobCard({ job }: { job: JobView }) {
  const [pending, startTransition] = useTransition();

  function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as JobStatus;
    if (next === job.status) return;
    startTransition(() => updateJobStatus(job._id, next));
  }

  function handleDelete() {
    if (!confirm(`Delete ${job.roleTitle} at ${job.companyName}?`)) return;
    startTransition(() => deleteJob(job._id));
  }

  return (
    <div
      className={`bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow ${
        pending ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h4 className="font-bold text-gray-900 truncate">{job.roleTitle}</h4>
          <p className="text-sm text-gray-500 truncate">{job.companyName}</p>
        </div>
        <button
          type="button"
          onClick={handleDelete}
          disabled={pending}
          className="text-gray-400 hover:text-red-500 transition-colors p-1 -m-1"
          aria-label="Delete job"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {job.location && (
        <p className="text-xs text-gray-500 mt-1 truncate">{job.location}</p>
      )}

      {job.salaryRange && (
        <div className="mt-2 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded w-fit">
          {job.salaryRange}
        </div>
      )}

      <div className="mt-3 flex items-center justify-between gap-2">
        <select
          value={job.status}
          onChange={handleStatusChange}
          disabled={pending}
          className="text-xs border border-gray-200 rounded px-2 py-1 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-400"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {job.applicationUrl && (
          <a
            href={job.applicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-500 hover:text-gray-900 inline-flex items-center gap-1"
          >
            View <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
}
