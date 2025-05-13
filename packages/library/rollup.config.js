import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import dts from 'rollup-plugin-dts'
import postcss from 'rollup-plugin-postcss'
import pkg from './package.json' with { type: 'json' }

// Extract peer dependencies to mark them as external
const external = Object.keys(pkg.peerDependencies || {})

const commonPlugins = [
  resolve({
    browser: true,
    preferBuiltins: false,
  }),
  commonjs(),
]

export default [
  // Main build (ES and CJS)
  {
    input: 'src/index.ts',
    external: (id) => {
      // Mark peer dependencies as external
      if (external.some((dep) => id.startsWith(dep))) {
        return true
      }
      // Also exclude any node_modules that aren't bundled
      return /node_modules/.test(id)
    },
    output: [
      {
        file: pkg.main, // dist/index.js
        format: 'cjs',
        sourcemap: true,
        exports: 'named',
      },
      {
        file: pkg.module, // dist/index.esm.js
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      postcss({
        extract: 'index.css', // Extract CSS to a separate file
        minimize: true,
        use: [
          [
            'sass',
            {
              silenceDeprecations: ['legacy-js-api'],
            },
          ],
        ],
      }),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false, // We'll handle declarations separately
        declarationMap: false,
        exclude: ['**/*.test.*', '**/*.stories.*'],
      }),
      ...commonPlugins,
    ],
  },
  // Type declarations build
  {
    input: 'src/index.ts',
    output: {
      file: pkg.types, // dist/index.d.ts
      format: 'esm',
    },
    external: [...external, /\.scss$/], // Also mark .scss files as external
    plugins: [
      postcss({
        extract: false, // Don't extract CSS during type generation
        inject: false,
      }),
      dts({
        tsconfig: './tsconfig.json',
        // Only process TypeScript files, skip CSS/SCSS
        compilerOptions: {
          declaration: true,
          emitDeclarationOnly: true,
        },
      }),
    ],
  },
]
