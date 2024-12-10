'use client';

import { useState, useEffect, use } from 'react';
import { Task } from '../../../types/task';
import { api } from '../../../utils/api';
import TaskForm from '../../../components/TaskForm';
import { useRouter } from 'next/navigation';

interface EditTaskPageProps {
  params: Promise<{ id: string }>;
}

export default function EditTaskPage({ params }: EditTaskPageProps) {
  const router = useRouter();
  const { id } = use(params); // Unwrap the params Promise
  const [task, setTask] = useState<Task | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTask = async () => {
      try {
        const response = await fetch(`http://localhost:3001/tasks/${id}`);
        if (!response.ok) {
          setError(`Task with ID ${id} not found`);
          router.push('/');
          return;
        }
        const data = await response.json();
        setTask(data);
      } catch (err) {
        setError('Failed to load task');
        router.push('/');
      }
    };
    loadTask();
  }, [id, router]);

  async function handleTaskUpdate(updatedTask: Task) {
    try {
      await api.updateTask(updatedTask.id, updatedTask);
      setTask(updatedTask);
    } catch (err) {
      setError('Failed to update task');
    }
  }

  if (error) return <div className="text-red-500">{error}</div>;
  if (!task) return <div>Loading...</div>;

  return (
    <main className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Edit Task</h1>
      <TaskForm mode="edit" task={task} onUpdate={handleTaskUpdate} />
    </main>
  );
}
