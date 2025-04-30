import globals from 'globals'
import pluginJs from '@eslint/js'
import tsEslint from 'typescript-eslint'
import eslintConfigPrettierRecommended from 'eslint-plugin-prettier/recommended'
import { defineConfig } from 'eslint/config'

/** @type {import('eslint').Linter.Config[]} */
export default defineConfig([
  {
    ignores: ['/node_modules/**', '**/dist/**', '**/public/**', '**/.vscode/**', '**/.idea/**']
  },
  pluginJs.configs.recommended,
  ...tsEslint.configs.recommended,
  eslintConfigPrettierRecommended,
  {
    name: 'butterfly-ts-lint',
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: {
      globals: {
        ...globals.browser
      }
    },
    rules: {
      'no-control-regex': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      'prefer-const': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true
        }
      ]
    }
  }
])
