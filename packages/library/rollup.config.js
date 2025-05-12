import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import dts from 'rollup-plugin-dts'
import postcss from 'rollup-plugin-postcss'

// Custom plugin to filter out SCSS imports from declaration files
const filterScssImports = () => ({
  name: 'filter-scss-imports',
  resolveId(id, importer) {
    if (id.endsWith('.scss') || id.endsWith('.sass')) {
      return { id, external: true }
    }
    return null
  },
})

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/index.esm.js',
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      resolve(),
      commonjs(),
      postcss({
        extract: 'index.css',
        minimize: true,
      }),
      typescript({
        tsconfig: './tsconfig.json',
      }),
    ],
    external: ['react', 'react-dom', 'react-router-dom'],
  },
  {
    input: 'dist/types/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
    plugins: [dts(), filterScssImports()],
  },
]
