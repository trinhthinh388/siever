/// <reference types='vitest' />
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import babel from 'vite-plugin-babel';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../node_modules/.vite/playground',
  server: {
    port: 4200,
    host: 'localhost',
  },
  preview: {
    port: 4200,
    host: 'localhost',
  },
  build: {
    emptyOutDir: true,
    reportCompressedSize: true,
    outDir: '../dist/playground',
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  plugins: [
    babel({
      babelConfig: {
        plugins: ['babel-plugin-transform-typescript-metadata'],
      },
    }),
    react(),
    nxViteTsPaths(),
    nxCopyAssetsPlugin(['*.md']),
  ],
}));
