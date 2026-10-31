import { AppNavigation } from './appNavigation';
import { AppRoutes } from './appRoutes';

export function RoutedApp() {
  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-neutral-900 text-slate-900 dark:text-neutral-100">
      <div className="w-full md:w-2/3 mx-auto">
        <header className="sticky top-0 z-20 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border-b border-gray-200 dark:border-neutral-700">
          <div className="px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-md overflow-hidden flex items-center justify-center">
                <img
                  src="/SnapAdmin.svg"
                  alt="SnapAdmin logo"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <div className="font-semibold">SnapAdmin</div>
                <div className="text-xs text-gray-500 dark:text-neutral-400">
                  Snapraid Web Portal
                </div>
              </div>
            </div>

            <AppNavigation />
          </div>
        </header>

        <main className="w-full px-4 py-6">
          <AppRoutes />
        </main>
      </div>
    </div>
  );
}
