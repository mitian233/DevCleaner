import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs'],
  target: 'node18',
  clean: true,
  minify: false,
  sourcemap: false,
  dts: false,
  shims: true,
  outExtension() {
    return { js: '.cjs' }
  },
})
