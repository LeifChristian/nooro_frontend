'use client';

import { useState, useEffect } from 'react';
import { Task } from '../types/task';
import { api } from '../utils/api';
import { Trash2, CheckCircle, Circle, Clock } from 'lucide-react';
import Link from 'next/link';

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const tasks = await api.getTasks();
        setTasks(tasks);
      } catch (err) {
        setError('Failed to load tasks');
      }
    };
    loadTasks();
  }, []);

  const handleDelete = async (id: number) => {
    const task = tasks.find(t => t.id === id);
    const confirmDelete = window.confirm(`Are you sure you want to delete "${task?.title}"?`);
    
    if (confirmDelete) {
      try {
        await api.deleteTask(id);
        setTasks(tasks.filter((task) => task.id !== id));
      } catch (err) {
        setError('Failed to delete task');
      }
    }
  };

  const handleToggleComplete = async (id: number) => {
    try {
      const updatedTask = await api.toggleTask(id);
      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, completed: updatedTask.completed } : task
        )
      );
    } catch (err) {
      setError('Failed to toggle task');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`
            flex items-center justify-between bg-white shadow-md p-4 mb-4 rounded-lg
            ${task.color === 'red' ? 'border-2 border-red-500' :
              task.color === 'blue' ? 'border-2 border-blue-500' :
              'border-2 border-green-500'}
          `}
        >
          <div className="flex flex-col gap-2 flex-grow">
            <div className="flex items-center gap-4">
              <button onClick={() => handleToggleComplete(task.id)}>
                {task.completed ? (
                  <CheckCircle size={24} color="green" />
                ) : (
                  <Circle size={24} color="gray" />
                )}
              </button>
              <Link
                href={`/tasks/${task.id}/edit`}
                className={`
                  text-lg font-medium 
                  ${task.completed ? 'line-through text-gray-500' : 
                    task.color === 'red' ? 'text-red-500' :
                    task.color === 'blue' ? 'text-blue-500' :
                    'text-green-500'}
                `}
              >
                {task.title}
              </Link>
            </div>
            <div className="flex items-center text-sm text-gray-500 ml-10">
              <Clock size={14} className="mr-1" />
              <span>Created: {formatDate(task.createdAt)}</span>
              {task.updatedAt !== task.createdAt && (
                <span className="ml-4">
                  • Updated: {formatDate(task.updatedAt)}
                </span>
              )}
            </div>
          </div>
          <button 
            onClick={() => handleDelete(task.id)}
            className="ml-4"
          >
            <Trash2 size={20} color="red" />
          </button>
        </div>
      ))}
      {tasks.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No tasks yet. Create one to get started!
        </div>
      )}
    </div>
  );
}