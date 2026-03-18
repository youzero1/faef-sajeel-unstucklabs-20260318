'use client';

import { useState, useEffect, useCallback } from 'react';
import TodoForm from './TodoForm';
import TodoItem from './TodoItem';

interface Todo {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch('/api/todos');
      if (!response.ok) throw new Error('Failed to fetch todos');
      const data = await response.json();
      setTodos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const completedCount = todos.filter((t) => t.completed).length;
  const pendingCount = todos.filter((t) => !t.completed).length;

  return (
    <div className="max-w-2xl mx-auto">
      <TodoForm onTodoAdded={fetchTodos} />

      <div className="mb-4 flex items-center gap-4 text-sm text-gray-500">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-blue-400 inline-block"></span>
          {pendingCount} pending
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span>
          {completedCount} completed
        </span>
        <span className="ml-auto">{todos.length} total</span>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <svg className="animate-spin h-8 w-8 mb-3" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <p>Loading tasks...</p>
        </div>
      ) : error ? (
        <div className="p-5 bg-red-50 border border-red-200 rounded-2xl text-center">
          <p className="text-red-600 font-medium mb-2">Error loading tasks</p>
          <p className="text-red-500 text-sm mb-4">{error}</p>
          <button
            onClick={fetchTodos}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
          >
            Retry
          </button>
        </div>
      ) : todos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <svg className="w-16 h-16 mb-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-lg font-medium">No tasks yet</p>
          <p className="text-sm mt-1">Add your first task above!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onUpdate={fetchTodos}
              onDelete={fetchTodos}
            />
          ))}
        </div>
      )}
    </div>
  );
}
