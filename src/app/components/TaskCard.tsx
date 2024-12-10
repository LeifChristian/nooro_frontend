'use client';

import { Task } from '../types/task';
import { Trash2 } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onToggle: (id: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onClick: () => void;
}

export default function TaskCard({ task, onToggle, onDelete, onClick }: TaskCardProps) {
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this task?')) {
      await onDelete(task.id);
    }
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle(task.id);
  };

  return (
    <div
      onClick={onClick}
      className={`
        p-4 rounded-lg border cursor-pointer
        ${task.color === 'red' ? 'border-red-200 hover:bg-red-50' : 
          task.color === 'blue' ? 'border-blue-200 hover:bg-blue-50' : 
          'border-green-200 hover:bg-green-50'}
        transition-colors
      `}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={(e) => handleToggle(e as unknown as React.MouseEvent)}
            className="h-5 w-5 rounded border-gray-300 focus:ring-black" // Added focus:ring-black for better visibility
          />
          <span
            className={`
              text-lg 
              ${task.completed ? 'line-through text-gray-500' : 'text-black'}
            `}
          >
            {task.title}
          </span>
        </div>
        <button
          onClick={handleDelete}
          className="text-gray-500 hover:text-red-500 transition-colors"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
