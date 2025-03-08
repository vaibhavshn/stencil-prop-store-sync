import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/lib/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  outDir: 'build',
  external: ['@stencil/*'],
});
