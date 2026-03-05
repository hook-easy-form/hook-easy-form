import sourceMap from 'rollup-plugin-sourcemaps';
import { uglify } from 'rollup-plugin-uglify';

import pj from './package.json';

const external = ['react'];

export default {
  input: 'dist/index.js',
  external,
  output: [
    {
      file: pj.main,
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
    },
    {
      file: pj.module,
      format: 'es',
      exports: 'named',
      sourcemap: true,
    },
  ],
  plugins: [
    sourceMap(),
    uglify(),
  ],
};
