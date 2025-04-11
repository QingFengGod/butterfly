import globals from 'globals'
import pluginJs from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import tsEslint from 'typescript-eslint'
import eslintConfigPrettierRecommended from 'eslint-plugin-prettier/recommended'
import parserVue from 'vue-eslint-parser'

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{ts,mts,tsx,vue,js,jsx}'] },
  {
    ignores: ['/node_modules/**', '**/dist/**', '**/public/**', '**/.vscode/**']
  },
  pluginJs.configs.recommended,
  ...tsEslint.configs.recommended,
  eslintConfigPrettierRecommended,
  ...pluginVue.configs['flat/essential'],
  {
    name: 'buttefly-admin-lint',
    languageOptions: {
      globals: {
        ...globals.browser,
        $BF: 'readonly'
      },
      parser: parserVue,
      parserOptions: {
        parser: tsEslint.parser
      }
    },
    rules: {
      'vue/no-v-html': 'off',
      'no-debugger': 'off',
      'no-control-regex': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      'prefer-const': 'off',
      'vue/html-self-closing': [
        'error',
        {
          html: { void: 'always', normal: 'always', component: 'always' },
          svg: 'always',
          math: 'always'
        }
      ],
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
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
]
