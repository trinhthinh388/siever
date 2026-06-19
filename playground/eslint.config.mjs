import nx from '@nx/eslint-plugin';
import baseConfig from '../eslint.config.mjs';

export default [
  ...nx.configs['flat/react'],
  ...baseConfig,
  {
    // Override or add rules here
    rules: {},
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
  },
];
