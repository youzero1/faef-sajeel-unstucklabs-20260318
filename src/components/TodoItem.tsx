'use client';

import { useState } from 'react';

interface Todo {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TodoItemProps {
  todo: Todo;
  onUpdate: () => void;
  onDelete: () => void;
}

export default function TodoItem({ todo, onUpdate, onDelete }: TodoItemProps) {
  const [loadingToggle, setLoadingToggle] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const handleToggle = async () => {
    setLoadingToggle(true);
    try {
      const response = await fetch(`/api/todos/${todo.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !todo.completed }),
      });
      if (!response.ok) throw new Error('Failed to update');
      onUpdate();
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingToggle(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    setLoadingDelete(true);
    try {
      const response = await fetch(`/api/todos/${todo.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete');
      onDelete();
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDelete(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border transition-all duration-200 p-5 flex items-start gap-4 ${
        todo.completed ? 'border-green-200 bg-green-50' : 'border-gray-200 hover:shadow-md'
      }`}
    >
      <button
        onClick={handleToggle}
        disabled={loadingToggle}
        className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
          todo.completed
            ? 'bg-green-500 border-green-500 text-white'
            : 'border-gray-300 hover:border-blue-400'
        } ${loadingToggle ? 'opacity-50 cursor-wait' : 'cursor-pointer'}`}
        title={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {todo.completed && (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <h3
          className={`text-base font-semibold break-words ${
            todo.completed ? 'line-through text-gray-400' : 'text-gray-800'
          }`}
        >
          {todo.title}
        </h3>
        {todo.description && (
          <p
            className={`mt-1 text-sm break-words ${
              todo.completed ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            {todo.description}
          </p>
        )}
        <p className="mt-2 text-xs text-gray-400">{formatDate(todo.createdAt)}</p>
      </div>

      <button
        onClick={handleDelete}
        disabled={loadingDelete}
        className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-wait"
        title="Delete task"
      >
        {loadingDelete ? (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        )}
      </button>
    </div>
  );
}
