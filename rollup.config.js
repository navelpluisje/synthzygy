import typescript from 'rollup-plugin-typescript2'
import html from '@movable/rollup-plugin-html'
import css from '@navelpluisje/rollup-plugin-css'
import pkg from './package.json'

export default [{
  input: {
    index: 'src/app.ts',
    cvInput: 'src/processors/cvInput/index.ts',
  },
  output: [
    {
      dir: 'dist',
      name: '[name].js',
      format: 'cjs',
    },
    {
      dir: 'dist',
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
      include: '**/*.html'
    }),
    css(),
    typescript({
      typescript: require('typescript'),
    })
  ],
}]