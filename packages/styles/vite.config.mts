/// <reference types='vitest' />
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import * as path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/packages/styles',
  plugins: [nxViteTsPaths(), nxCopyAssetsPlugin(['*.md'])],
  build: {
    emptyOutDir: true,
    reportCompressedSize: true,
    outDir: '../../dist/packages/styles',
    rollupOptions: {
      input: path.join(import.meta.dirname, 'src/index.scss'),
      output: {
        assetFileNames: '[name][extname]',
      },
    },
  },
}));
