import React from 'react';
import { Briefcase, Clock, CheckCircle, XCircle, Star } from 'lucide-react';
import JobCard from './JobCard';
import type { JobView } from '@/lib/actions/jobs';
import type { JobStatus } from '@/models/Job';

const COLUMNS: { id: JobStatus; title: string; icon: React.ReactNode }[] = [
  { id: 'wishlist', title: 'Wishlist', icon: <Star className="w-4 h-4" /> },
  { id: 'applied', title: 'Applied', icon: <Clock className="w-4 h-4" /> },
  { id: 'interview', title: 'Interview', icon: <Briefcase className="w-4 h-4" /> },
  { id: 'offer', title: 'Offer', icon: <CheckCircle className="w-4 h-4 text-green-500" /> },
  { id: 'rejected', title: 'Rejected', icon: <XCircle className="w-4 h-4 text-red-500" /> },
];

export default function KanbanBoard({ jobs }: { jobs: JobView[] }) {
  const byStatus = new Map<JobStatus, JobView[]>();
  for (const col of COLUMNS) byStatus.set(col.id, []);
  for (const job of jobs) byStatus.get(job.status)?.push(job);

  return (
    <div className="flex gap-4 h-full overflow-x-auto pb-4">
      {COLUMNS.map((column) => {
        const columnJobs = byStatus.get(column.id) ?? [];
        return (
          <div
            key={column.id}
            className="shrink-0 w-80 bg-gray-50/50 rounded-xl flex flex-col border border-gray-200"
          >
            <div className="p-4 flex items-center justify-between border-b border-gray-200 bg-white rounded-t-xl">
              <div className="flex items-center gap-2 font-semibold text-gray-700">
                {column.icon}
                {column.title}
              </div>
              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">
                {columnJobs.length}
              </span>
            </div>

            <div className="p-3 flex flex-col gap-3 overflow-y-auto">
              {columnJobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
              {columnJobs.length === 0 && (
                <p className="text-xs text-gray-400 text-center py-6">No jobs yet</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
