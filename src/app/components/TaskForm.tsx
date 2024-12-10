'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Task, CreateTaskInput, UpdateTaskInput, TaskFormData } from '../types/task';
import { api } from '../utils/api';
import { Home } from 'lucide-react'
import Link from 'next/link';

interface TaskFormProps {
  task?: Task;
  mode: 'create' | 'edit';
  onUpdate?: (task: Task) => Promise<void>;
}

export default function TaskForm({ task, mode, onUpdate }: TaskFormProps) {
  const router = useRouter();
  
  const [formData, setFormData] = useState<TaskFormData>({
    title: task?.title || '',
    color: task?.color || 'blue',
    completed: task?.completed || false,
  });
  
  const [error, setError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState<boolean>(false);

  // Handle toggle complete
  const handleToggleComplete = async () => {
    if (task?.id) {
      try {
        const updatedTask = await api.toggleTask(task.id);
        setFormData(prev => ({ ...prev, completed: updatedTask.completed }));
        if (onUpdate) {
          await onUpdate(updatedTask);
        }
      } catch (err) {
        setError('Failed to toggle task');
      }
    }
  };

  // Rest of your existing useEffects...

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      let updatedTask: Task;
      if (mode === 'create') {
        updatedTask = await api.createTask(formData as CreateTaskInput);
      } else if (task) {
        updatedTask = await api.updateTask(task.id, formData as UpdateTaskInput);
      } else {
        throw new Error('Invalid task data');
      }

      if (onUpdate) {
        await onUpdate(updatedTask);
      }
      router.push('/');
    } catch (err) {
      console.error(err);
      setError('Failed to save task');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="text-red-500">{error}</div>}
      <Link
        href="/"
        className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
      >
        <Home size={20} /> Back to Tasks
      </Link>
    

      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1 block w-full rounded-md border text-black border-gray-300 px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Color</label>
        <div className="mt-1 flex space-x-4">
          {(['red', 'blue', 'green'] as const).map((color) => (
            <label key={color} className="flex items-center space-x-2">
              <input
                type="radio"
                name="color"
                value={color}
                checked={formData.color === color}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    color: e.target.value as 'red' | 'blue' | 'green',
                  })
                }
                className="text-blue-600"
              />
              <span className="capitalize">{color}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="flex items-center text-sm font-medium text-gray-700">
          <input
            type="checkbox"
            checked={formData.completed}
            onChange={() => {
              if (mode === 'edit' && task?.id) {
                handleToggleComplete();
              } else {
                setFormData(prev => ({ ...prev, completed: !prev.completed }));
              }
            }}
            className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <span>Completed</span>
        </label>
      </div>

      <div className="flex space-x-4">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          {mode === 'create' ? 'Create Task' : 'Update Task'}
        </button>
        <button
          type="button"
          onClick={() => {
            if (isDirty) {
              if (confirm('You have unsaved changes. Are you sure you want to cancel?')) {
                router.back();
              }
            } else {
              router.back();
            }
          }}
          className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}