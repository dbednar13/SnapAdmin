import './App.css';
import CommandButtonGroup from './components/commandButtonGroup';
import OutputArea from './components/output';

function App() {
  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-neutral-900 text-slate-900 dark:text-neutral-100">
      <div className="w-full md:w-2/3 mx-auto">
        <header className="sticky top-0 z-20 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border-b border-gray-200 dark:border-neutral-700">
          <div className="px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-indigo-500 rounded-md flex items-center justify-center text-white font-bold">
                S
              </div>
              <div>
                <div className="font-semibold">SnapAdmin</div>
                <div className="text-xs text-gray-500 dark:text-neutral-400">
                  Admin UI placeholder
                </div>
              </div>
            </div>
            <nav className="space-x-4 text-sm text-gray-600 dark:text-neutral-300">
              <button className="px-3 py-1 rounded hover:bg-gray-100 dark:hover:bg-neutral-700">
                Link 1
              </button>
              <button className="px-3 py-1 rounded hover:bg-gray-100 dark:hover:bg-neutral-700">
                Link 2
              </button>
              <button className="px-3 py-1 rounded bg-indigo-600 text-white">
                Action
              </button>
            </nav>
          </div>
        </header>

        <main className="w-full px-4 py-6">
          <section className="mb-6">
            <h1 className="text-2xl font-semibold">Overview</h1>
            <p className="text-sm text-gray-600 dark:text-neutral-400 mt-1">
              Header pinned above; grid below shows placeholders.
            </p>
          </section>

          <CommandButtonGroup />

          <OutputArea />
        </main>
      </div>
    </div>
  );
}

export default App;
