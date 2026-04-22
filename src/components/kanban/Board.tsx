import React from 'react';
import { Briefcase, Clock, CheckCircle, XCircle, Star } from 'lucide-react';

const COLUMNS = [
  { id: 'wishlist', title: 'Wishlist', icon: <Star className="w-4 h-4" /> },
  { id: 'applied', title: 'Applied', icon: <Clock className="w-4 h-4" /> },
  { id: 'interview', title: 'Interview', icon: <Briefcase className="w-4 h-4" /> },
  { id: 'offer', title: 'Offer', icon: <CheckCircle className="w-4 h-4 text-green-500" /> },
  { id: 'rejected', title: 'Rejected', icon: <XCircle className="w-4 h-4 text-red-500" /> },
];

export default function KanbanBoard({ jobs }: { jobs: any[] }) {
  return (
    <div className="flex gap-4 h-full overflow-x-auto pb-4">
      {COLUMNS.map((column) => (
        <div key={column.id} className="flex-shrink-0 w-80 bg-gray-50/50 rounded-xl flex flex-col border border-gray-200">
          {/* Column Header */}
          <div className="p-4 flex items-center justify-between border-b border-gray-200 bg-white rounded-t-xl">
            <div className="flex items-center gap-2 font-semibold text-gray-700">
              {column.icon}
              {column.title}
            </div>
            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">
              {jobs.filter(j => j.status === column.id).length}
            </span>
          </div>

          {/* Column Body */}
          <div className="p-3 flex flex-col gap-3 overflow-y-auto">
            {jobs
              .filter((job) => job.status === column.id)
              .map((job) => (
                <div 
                  key={job._id} 
                  className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing"
                >
                  <h4 className="font-bold text-gray-900">{job.roleTitle}</h4>
                  <p className="text-sm text-gray-500">{job.companyName}</p>
                  {job.salaryRange && (
                    <div className="mt-2 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded w-fit">
                      {job.salaryRange}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}