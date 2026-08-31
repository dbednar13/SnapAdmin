import { type ActionButton, buttons } from './buttons';

const CommandButtonGroup = () => {
  return (
    <section>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {buttons.map((button: ActionButton) => {
          const Icon = button.icon;
          const optionHelp = button.helpContext?.options
            ?.map(
              (option) =>
                `-${option.short}, --${option.long}: ${option.helpText}`
            )
            .join('\n')
            .trim();
          const helpText = [
            button.helpContext?.verb?.helpText,
            button.description,
            optionHelp,
          ]
            .filter(Boolean)
            .join('\n\n');

          return (
            <button
              type="button"
              key={button.command}
              title={helpText || 'No additional help available.'}
              className="group relative overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-white/80 p-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-neutral-700 dark:bg-neutral-800/70 dark:focus:ring-offset-neutral-900"
            >
              <div className="flex h-full flex-col justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 shadow-inner dark:bg-indigo-500/10 dark:text-indigo-300">
                    <Icon className="h-6 w-6" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="text-lg font-semibold text-slate-800 dark:text-neutral-100">
                      {button.title}
                    </div>
                    <div className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-slate-400 dark:text-neutral-500">
                      {button.command}
                    </div>
                  </div>
                </div>

                <div className="mt-3 text-sm leading-6 text-slate-600 dark:text-neutral-300 text-center">
                  {button.description}
                </div>
              </div>

              <div className="pointer-events-none absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                <div className="max-h-52 overflow-y-auto rounded-xl border border-slate-200 bg-slate-900/95 p-3 text-left text-xs leading-5 text-slate-100 shadow-xl dark:border-neutral-700">
                  <div className="mb-2 font-semibold text-white">
                    {button.helpContext?.verb?.verb || button.command}
                  </div>

                  <div className="mb-2 text-slate-200">
                    {button.helpContext?.verb?.helpText || button.description}
                  </div>

                  {button.helpContext?.options?.length ? (
                    <ul className="space-y-1 text-slate-200">
                      {button.helpContext.options.map((option) => (
                        <li key={`${button.command}-${option.short}`}>
                          <span className="font-medium text-indigo-300">
                            -{option.short}, --{option.long}
                          </span>
                          : {option.helpText}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default CommandButtonGroup;
