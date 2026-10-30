import type { ServerConfig } from 'common';
import { type SubmitEvent, useEffect, useState } from 'react';
import { useBeforeUnload, useBlocker } from 'react-router';

export default function AdminConfig() {
  const [port, setPort] = useState('');
  const [snapRaidConfigPath, setSnapRaidConfigPath] = useState('');
  const [initialConfig, setInitialConfig] = useState<ServerConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const isDirty =
    initialConfig !== null &&
    (port !== String(initialConfig.port) ||
      snapRaidConfigPath !== (initialConfig.snapRaidConfigPath ?? ''));
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
    const loadConfig = async () => {
      try {
        const response = await fetch('/api/config');
        if (!response.ok) {
          throw new Error('Unable to load server settings.');
        }

        const config = (await response.json()) as ServerConfig;
        setPort(String(config.port));
        setSnapRaidConfigPath(config.snapRaidConfigPath ?? '');
        setInitialConfig(config);
      } catch (error) {
        setMessage(
          error instanceof Error
            ? error.message
            : 'Unable to load server settings.'
        );
      } finally {
        setLoading(false);
      }
    };

    void loadConfig();
  }, []);

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!initialConfig || !/^\d+$/.test(port)) {
      setMessage('Enter a valid numeric port.');
      return;
    }

    const updatedConfig: ServerConfig = {
      port: Number(port),
      snapRaidConfigPath: snapRaidConfigPath.trim() || undefined,
    };

    setSaving(true);
    setMessage('');
    try {
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedConfig),
      });

      const result = (await response.json()) as { message?: string };
      if (!response.ok) {
        throw new Error(result.message || 'Unable to save server settings.');
      }

      setInitialConfig(updatedConfig);
      setPort(String(updatedConfig.port));
      setSnapRaidConfigPath(updatedConfig.snapRaidConfigPath ?? '');
      setMessage(result.message || 'Server settings saved.');
      if (updatedConfig.port !== initialConfig.port) {
        window.alert(
          'The port has changed. Manually reboot the server for the change to take effect.'
        );
      }
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Unable to save server settings.'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mx-auto max-w-2xl text-center">
      <header className="mb-6 border-b border-gray-200 pb-4 dark:border-neutral-700">
        <h1 className="text-2xl font-semibold">Server Settings</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-neutral-400">
          Configure the web server and SnapRAID configuration file.
        </p>
      </header>

      {loading ? (
        <p
          role="status"
          className="text-sm text-gray-600 dark:text-neutral-400"
        >
          Loading settings...
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="server-port"
              className="mb-1 block text-sm font-medium"
            >
              Server port
            </label>
            <input
              id="server-port"
              name="port"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              required
              value={port}
              onChange={(event) => {
                if (/^\d*$/.test(event.target.value)) {
                  setPort(event.target.value);
                }
              }}
              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-center text-sm dark:border-neutral-600 dark:bg-neutral-800"
            />
          </div>

          <div>
            <label
              htmlFor="snapraid-config-path"
              className="mb-1 block text-sm font-medium"
            >
              SnapRAID config path
            </label>
            <input
              id="snapraid-config-path"
              name="snapRaidConfigPath"
              type="text"
              value={snapRaidConfigPath}
              onChange={(event) => setSnapRaidConfigPath(event.target.value)}
              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-center text-sm dark:border-neutral-600 dark:bg-neutral-800"
            />
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              type="submit"
              disabled={saving || !initialConfig}
              className="rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save settings'}
            </button>
            {message && (
              <p
                role="status"
                className="text-sm text-gray-600 dark:text-neutral-400"
              >
                {message}
              </p>
            )}
          </div>
        </form>
      )}
    </section>
  );
}
