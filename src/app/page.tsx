import TodoList from '@/components/TodoList';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
            📝 My Todo List
          </h1>
          <p className="text-gray-500 text-lg">Stay organized and get things done</p>
        </div>
        <TodoList />
      </div>
    </main>
  );
}
