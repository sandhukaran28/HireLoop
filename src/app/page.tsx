import KanbanBoard from '@/components/kanban/Board';
import AddJobButton from '@/components/kanban/AddJobButton';
import { getJobsForCurrentUser } from '@/lib/actions/jobs';

export default async function Home() {
  const jobs = await getJobsForCurrentUser();

  return (
    <main className="min-h-screen bg-white p-8">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">HireLoop</h1>
          <p className="text-gray-500">Track your path to your next big role.</p>
        </div>
        <AddJobButton />
      </header>

      <KanbanBoard jobs={jobs} />
    </main>
  );
}
