import tseslint from 'typescript-eslint';
import configs from 'rete-cli/configs/eslint.mjs';
import globals from 'globals'

export default tseslint.config(
  {
    ignores: ['assets'],
    languageOptions: {
      globals: {
        ...globals.node
      }
    }
  },
  ...configs,
  {
    rules: {
      'global-require': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      'no-console': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/only-throw-error': 'off',
    }
  }
)