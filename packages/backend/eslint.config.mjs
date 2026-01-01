import prettierConfig from 'eslint-config-prettier';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

import eslint from '@eslint/js';

export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    parserOptions: {
      tsconfigRootDir: import.meta.dirname,
    },
  },
  prettierConfig
);
