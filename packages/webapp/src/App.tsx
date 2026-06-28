import './App.css';

function App() {
  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <div className="page-wrapper">
        <header className="sticky top-0 z-20 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-b border-gray-200 dark:border-slate-700">
          <div className="px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-indigo-500 rounded-md flex items-center justify-center text-white font-bold">
                S
              </div>
              <div>
                <div className="font-semibold">SnapAdmin</div>
                <div className="text-xs text-gray-500 dark:text-slate-400">
                  Admin UI placeholder
                </div>
              </div>
            </div>
            <nav className="space-x-4 text-sm text-gray-600 dark:text-slate-300">
              <button className="px-3 py-1 rounded hover:bg-gray-100 dark:hover:bg-slate-700">
                Link 1
              </button>
              <button className="px-3 py-1 rounded hover:bg-gray-100 dark:hover:bg-slate-700">
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
            <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
              Header pinned above; grid below shows placeholders.
            </p>
          </section>

          <section>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-44 rounded-lg border-2 border-dashed border-gray-300 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60 flex items-center justify-center"
                >
                  <div className="text-center">
                    <div className="text-gray-500 dark:text-slate-400">
                      Placeholder {i}
                    </div>
                    <div className="mt-2">
                      <button className="text-sm text-indigo-600 dark:text-indigo-400">
                        Open
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
