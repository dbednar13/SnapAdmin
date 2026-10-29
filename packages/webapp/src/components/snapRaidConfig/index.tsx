import type { SnapRaidConfig, SnapRaidConfigWithValidation } from 'common';
import { type SubmitEvent, useEffect, useState } from 'react';
import { Link, useBeforeUnload, useBlocker, useNavigate } from 'react-router';

import Content from './content';
import DataSources from './dataSources';
import GeneralSettings from './generalSettings';
import Parity from './parity';
import Patterns from './patterns';

const toEditableConfig = (
  result: SnapRaidConfigWithValidation
): SnapRaidConfig => ({
  parityFile1: result.parityFile1 ?? '',
  parityFile2: result.parityFile2 ?? '',
  parityFile3: result.parityFile3 ?? '',
  parityFile4: result.parityFile4 ?? '',
  parityFile5: result.parityFile5 ?? '',
  parityFile6: result.parityFile6 ?? '',
  contentFiles: result.contentFiles ?? [],
  snapShotSources: result.snapShotSources ?? [],
  excludePatterns: result.excludePatterns ?? [],
  includePatterns: result.includePatterns ?? [],
  blockSizeKB: result.blockSizeKB,
  autoSaveGB: result.autoSaveGB,
  nohidden: result.nohidden,
});

export default function SnapRaidConfigPage() {
  const navigate = useNavigate();
  const [config, setConfig] = useState<SnapRaidConfig | null>(null);
  const [initialConfig, setInitialConfig] = useState<SnapRaidConfig | null>(
    null
  );
  const [configErrors, setConfigErrors] = useState<string[]>([]);
  const [configWarnings, setConfigWarnings] = useState<string[]>([]);
  const [saveErrors, setSaveErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [missingConfigPath, setMissingConfigPath] = useState(false);
  const [navigateAfterSave, setNavigateAfterSave] = useState(false);
  const isDirty =
    config !== null &&
    initialConfig !== null &&
    JSON.stringify(config) !== JSON.stringify(initialConfig);
  const blocker = useBlocker(isDirty);

  useBeforeUnload((event) => {
    if (isDirty) {
      event.preventDefault();
    }
  });

  useEffect(() => {
    if (blocker.state === 'blocked') {
      if (window.confirm('You have unsaved changes. Leave without saving?')) {
        blocker.proceed();
      } else {
        blocker.reset();
      }
    }
  }, [blocker]);

  useEffect(() => {
    if (navigateAfterSave) {
      navigate('/', { replace: true });
    }
  }, [navigate, navigateAfterSave]);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch('/api/snapConfig');
        const result =
          (await response.json()) as SnapRaidConfigWithValidation & {
            message?: string;
          };

        if (!response.ok) {
          throw new Error(result.message || 'Unable to load SnapRAID config.');
        }

        const hasConfigPathError = result.configErrors.some((error) =>
          error.toLowerCase().includes('snapraid config path is not set')
        );
        const editableConfig = toEditableConfig(result);

        setMissingConfigPath(hasConfigPathError);
        setConfigErrors(result.configErrors ?? []);
        setConfigWarnings(result.configWarnings ?? []);
        setConfig(editableConfig);
        if (!hasConfigPathError) {
          setInitialConfig(editableConfig);
        }
      } catch (error) {
        setSaveErrors([
          error instanceof Error
            ? error.message
            : 'Unable to load SnapRAID config.',
        ]);
      } finally {
        setLoading(false);
      }
    };

    void loadConfig();
  }, []);

  const updateConfig = <K extends keyof SnapRaidConfig>(
    key: K,
    value: SnapRaidConfig[K]
  ) => {
    setConfig((current) => (current ? { ...current, [key]: value } : current));
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!config) {
      return;
    }

    setSaving(true);
    setSaveErrors([]);
    try {
      const response = await fetch('/api/snapConfig', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      const result = (await response.json()) as {
        message?: string;
        errors?: string[];
      };

      if (!response.ok) {
        throw new Error(
          result.errors?.join(' ') ||
            result.message ||
            'Unable to save SnapRAID config.'
        );
      }

      setInitialConfig(config);
      setNavigateAfterSave(true);
    } catch (error) {
      setSaveErrors([
        error instanceof Error
          ? error.message
          : 'Unable to save SnapRAID config.',
      ]);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mx-auto max-w-4xl">
      <header className="mb-6 border-b border-gray-200 pb-4 dark:border-neutral-700">
        <h1 className="text-2xl font-semibold">SnapRAID Configuration</h1>
      </header>

      {loading ? (
        <p
          role="status"
          className="text-sm text-gray-600 dark:text-neutral-400"
        >
          Loading configuration...
        </p>
      ) : (
        <>
          {missingConfigPath && (
            <div
              role="alert"
              className="mb-4 border-l-4 border-red-600 bg-red-50 px-4 py-3 text-sm text-red-950 dark:bg-red-950/40 dark:text-red-100"
            >
              <p className="font-semibold">SnapRAID config path is not set.</p>
              <p className="mt-1">
                Define the config file in{' '}
                <Link
                  to="/admin-config"
                  className="font-semibold underline underline-offset-2"
                >
                  Admin Config
                </Link>
                .
              </p>
            </div>
          )}

          {configErrors.length > 0 && (
            <div
              role="alert"
              className="mb-4 border-l-4 border-red-600 bg-red-50 px-4 py-3 text-sm text-red-950 dark:bg-red-950/40 dark:text-red-100"
            >
              <p className="font-semibold">Configuration validation issues</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {configErrors.map((error, index) => (
                  <li key={`${index}-${error}`}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {configWarnings.length > 0 && (
            <div
              role="status"
              className="mb-4 border-l-4 border-amber-500 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:bg-amber-950/40 dark:text-amber-100"
            >
              <p className="font-semibold">Configuration warnings</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {configWarnings.map((warning, index) => (
                  <li key={`${index}-${warning}`}>{warning}</li>
                ))}
              </ul>
            </div>
          )}

          {saveErrors.length > 0 && (
            <div
              role="alert"
              className="mb-4 border-l-4 border-red-600 bg-red-50 px-4 py-3 text-sm text-red-950 dark:bg-red-950/40 dark:text-red-100"
            >
              <p className="font-semibold">Configuration request failed</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {saveErrors.map((error, index) => (
                  <li key={`${index}-${error}`}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {!missingConfigPath && config && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <Parity config={config} updateConfig={updateConfig} />

              <div className="grid gap-6 md:grid-cols-2">
                <Content config={config} updateConfig={updateConfig} />
                <DataSources config={config} updateConfig={updateConfig} />
              </div>

              <Patterns config={config} updateConfig={updateConfig} />

              <GeneralSettings config={config} updateConfig={updateConfig} />

              <div className="flex justify-end border-t border-gray-200 pt-5 dark:border-neutral-700">
                <button
                  type="submit"
                  disabled={saving || !isDirty}
                  className="rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save configuration'}
                </button>
              </div>
            </form>
          )}
        </>
      )}
    </section>
  );
}
