import nx from '@nx/eslint-plugin';
import perfectionist from 'eslint-plugin-perfectionist';
import preferArrowFunctions from 'eslint-plugin-prefer-arrow-functions';
import prettierPlugin from 'eslint-plugin-prettier/recommended';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: ['**/dist', '**/out-tsc', '**/vite.config.*.timestamp*'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/no-import-type-side-effects': 'error',
      '@typescript-eslint/method-signature-style': ['warn', 'property'],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: false,
          fixStyle: 'inline-type-imports',
        },
      ],
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
    },
  },
  {
    plugins: {
      perfectionist,
      'prefer-arrow-functions': preferArrowFunctions,
    },
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs',
    ],
    // Override or add rules here
    rules: {
      'perfectionist/sort-objects': [
        'error',
        {
          order: 'asc',
          type: 'line-length',
        },
      ],
      'perfectionist/sort-interfaces': [
        'error',
        {
          order: 'asc',
          type: 'line-length',
        },
      ],
      'perfectionist/sort-object-types': [
        'error',
        {
          order: 'asc',
          type: 'line-length',
        },
      ],
      'prefer-arrow-functions/prefer-arrow-functions': [
        'warn',
        {
          disallowPrototype: true,
          classPropertiesAllowed: true,
        },
      ],
      'perfectionist/sort-classes': [
        'error',
        {
          order: 'asc',
          type: 'unsorted',
          groups: [
            'index-signature',
            'static-property',
            'private-property',
            'protected-property',
            'property',
            'constructor',
            'static-method',
            'method',
            'protected-method',
            'private-method',
            ['get-method', 'set-method'],
            'unknown',
          ],
        },
      ],
    },
  },
  prettierPlugin,
];
