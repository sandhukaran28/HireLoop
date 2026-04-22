import KanbanBoard from '@/components/kanban/Board';
import connectDB from '@/lib/db';
import Job from '@/models/Job';

export default async function Home() {
  await connectDB();
  
  // Fetch jobs from MongoDB and convert to plain objects for the client
  const rawJobs = await Job.find({}).sort({ createdAt: -1 });
  const jobs = JSON.parse(JSON.stringify(rawJobs));

  return (
    <main className="min-h-screen bg-white p-8">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">HireLoop</h1>
          <p className="text-gray-500">Track your path to your next big role.</p>
        </div>
        <button className="bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors">
          + Add New Job
        </button>
      </header>

      <KanbanBoard jobs={jobs} />
    </main>
  );
}