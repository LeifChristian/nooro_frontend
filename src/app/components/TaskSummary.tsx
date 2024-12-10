'use client';

import { useEffect, useState } from 'react';
import { Task } from '../types/task';
import { api } from '../utils/api';

export default function TaskSummary() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await api.getTasks();
        setTasks(data);
      } catch (err) {
        console.error('Failed to load tasks for summary');
      }
    };
    loadTasks();
  }, []);

  const completedCount = tasks.filter(task => task.completed).length;

  return (
    <div className="mb-8 p-4 bg-gray-50 rounded-lg">
      <div className="text-lg text-black">
        Tasks: <span className="font-semibold">{tasks.length}</span>
      </div>
      <div className="text-lg text-black">
        Completed: <span className="font-semibold">{completedCount} of {tasks.length}</span>
      </div>
    </div>
  );
}