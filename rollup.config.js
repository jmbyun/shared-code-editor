import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import pkg from './package.json';

export default [
  // browser-friendly UMD build
  {
    input: 'src/main.js',
    output: {
      name: 'SharedCodeEditor',
      file: pkg.browser,
      format: 'umd'
    },
    plugins: [
      postcss({
        extensions: ['.css'],
      }),
      resolve(), // so Rollup can find `ms`
      babel({
        exclude: 'node_modules/**',
      }),
      commonjs(), // so Rollup can convert `ms` to an ES module
      serve(),
      livereload(),
    ],
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify 
  // `file` and `format` for each target)
  {
    input: 'src/main.js',
    external: ['ms'],
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' },
    ],
    plugins: [
      postcss({
        extensions: ['.css'],
      }),
      babel({
        exclude: 'node_modules/**',
      }),
    ]
  }
];