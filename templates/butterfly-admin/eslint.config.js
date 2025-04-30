import globals from 'globals'
import pluginJs from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import tsEslint from 'typescript-eslint'
import eslintConfigPrettierRecommended from 'eslint-plugin-prettier/recommended'
import parserVue from 'vue-eslint-parser'
import { defineConfig } from 'eslint/config'
/** @type {import('eslint').Linter.Config[]} */
export default defineConfig([
  { files: ['**/*.{vue,ts,js,tsx,jsx}'], ignores: ['/node_modules/**', '**/dist/**', '**/public/**', '**/.vscode/**'] },
  pluginJs.configs.recommended,
  ...tsEslint.configs.recommended,
  eslintConfigPrettierRecommended,
  ...pluginVue.configs['flat/essential'],
  {
    name: 'buttefly-admin-vue-lint',
    files: ['**/*.{vue,ts,js,tsx,jsx}'],
    languageOptions: {
      globals: { ...globals.browser, $BF: 'readonly' },
      parser: parserVue,
      parserOptions: {
        parser: tsEslint.parser
      }
    },
    rules: {
      'no-control-regex': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      'vue/no-v-html': 'off',
      'no-debugger': 'off',
      'prefer-const': 'off',
      'vue/multi-word-component-names': 'off',
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
      ],
      'vue/html-self-closing': [
        'error',
        {
          html: { void: 'always', normal: 'always', component: 'always' },
          svg: 'always',
          math: 'always'
        }
      ]
    }
  }
])
