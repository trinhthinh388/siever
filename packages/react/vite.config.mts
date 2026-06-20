/// <reference types='vitest' />
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import * as path from 'path';
import { defineConfig } from 'vite';
import babel from 'vite-plugin-babel';
import dts from 'vite-plugin-dts';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/packages/models',
  plugins: [
    babel({
      babelConfig: {
        plugins: ['babel-plugin-transform-typescript-metadata'],
      },
    }),
    nxViteTsPaths(),
    nxCopyAssetsPlugin(['*.md']),
    dts({
      entryRoot: 'src',
      pathsToAliases: false,
      tsconfigPath: path.join(import.meta.dirname, 'tsconfig.lib.json'),
    }),
  ],
  build: {
    emptyOutDir: true,
    reportCompressedSize: true,
    outDir: '../../dist/packages/models',
    rollupOptions: {
      external: [],
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    lib: {
      name: 'models',
      fileName: 'index',
      entry: 'src/index.ts',
      formats: ['es' as const],
    },
  },
}));
