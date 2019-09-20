import typescript from 'rollup-plugin-typescript2'
import html from '@movable/rollup-plugin-html'
import css from '@navelpluisje/rollup-plugin-css'
import copy from 'rollup-plugin-copy'
import pkg from './package.json'

export default [{
  input: {
    index: 'src/app.ts',
    processors: 'src/processors/index.ts',
  },
  output: [
    {
      dir: 'dist/app',
      name: '[name].js',
      format: 'cjs',
    },
    {
      dir: 'dist/app',
      name: '[name].js',
      format: 'es',
    },
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],

  plugins: [
    html({
      include: 'src/**/*.html',
      exclude: 'dist/index.html'
    }),
    css(),
    typescript({
      typescript: require('typescript'),
      objectHashIgnoreUnknownHack: true,
    }),
    copy({
      targets: [
        { src: 'src/index.html', dest: 'dist' },
        { src: 'src/style/**/*.css', dest: 'dist/style' },
        { src: 'src/assets/**/*', dest: 'dist/assets' }
      ]
    })  ],
}]