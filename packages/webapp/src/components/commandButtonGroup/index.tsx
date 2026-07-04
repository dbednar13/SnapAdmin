const CommandButtonGroup = () => {
  return (
    <section>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-44 rounded-lg border-2 border-dashed border-gray-300 dark:border-neutral-700 bg-white/60 dark:bg-neutral-800/60 flex items-center justify-center"
          >
            <div className="text-center">
              <div className="text-gray-500 dark:text-neutral-400">
                Placeholder {i}
              </div>
              <div className="mt-2">
                <button className="text-sm text-indigo-600 dark:text-neutral-300">
                  Open
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
export default CommandButtonGroup;
