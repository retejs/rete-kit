import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

import tseslint from 'typescript-eslint';
import configs, { extendNamingConventions } from 'rete-cli/configs/eslint.mjs';

export default tseslint.config(
    { ignores: ['dist'] },
  ...configs,
  {
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      '@typescript-eslint/naming-convention': ['error',
        ...extendNamingConventions({
          selector: 'function',
          format: [' 'camelCase, 'PascalCase'],
          leadingUnderscore: 'allow',
        }, {
          selector: 'variable',
          format: ['camelCase', 'PascalCase'],
          leadingUnderscore: 'allow',
        })
      ]
    }
  }
)
