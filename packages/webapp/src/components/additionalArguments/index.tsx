import { useState } from 'react';

type AdditionalArgumentsProps = {
  onValueChange: (value: string) => void;
};

const AdditionalArguments = ({ onValueChange }: AdditionalArgumentsProps) => {
  const [includeAdditionalArgs, setIncludeAdditionalArgs] = useState(false);
  const [textValue, setTextValue] = useState('');

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    setTextValue(nextValue);
    onValueChange(nextValue);
  };

  return (
    <>
      <div className="my-4 flex justify-center">
        <div className="flex items-center gap-2">
          <input
            id="include-additional-args"
            type="checkbox"
            checked={includeAdditionalArgs}
            onChange={(event) => setIncludeAdditionalArgs(event.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label
            htmlFor="include-additional-args"
            className="text-sm font-medium text-gray-700 dark:text-neutral-300"
          >
            Include additional arguments?
          </label>
        </div>
      </div>

      {includeAdditionalArgs && (
        <div className="my-4">
          <label
            htmlFor="additional-command-args"
            className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2"
          >
            Additional Command Arguments
          </label>
          <input
            id="additional-command-args"
            type="text"
            value={textValue}
            onChange={handleTextChange}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500"
            placeholder="Optional flags or arguments"
          />
        </div>
      )}
    </>
  );
};

export default AdditionalArguments;
