import { Suspense } from 'react';
import TaskList from './components/TaskList';
import TaskSummary from './components/TaskSummary';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <Link
          href="/tasks/new"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
        >
          <Plus size={20} /> Create Task
        </Link>
      </div>

      <Suspense fallback={<div>Loading summary...</div>}>
        <TaskSummary />
      </Suspense>

      <Suspense fallback={<div>Loading tasks...</div>}>
        <TaskList />
      </Suspense>
    </main>
  );
}
