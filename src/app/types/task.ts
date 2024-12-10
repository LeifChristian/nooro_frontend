// src/types/task.ts

export interface Task {
  id: number;
  title: string;
  color: 'red' | 'blue' | 'green';
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  title: string;
  color: 'red' | 'blue' | 'green';
  completed: boolean; // Now required
}

export interface UpdateTaskInput {
  title?: string;
  color?: 'red' | 'blue' | 'green';
  completed?: boolean; // Optional for partial updates
}

// New: Form Data Type
export interface TaskFormData {
  title: string;
  color: 'red' | 'blue' | 'green';
  completed: boolean;
}
