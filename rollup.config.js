import typescript from 'rollup-plugin-typescript2'
import html from '@movable/rollup-plugin-html'
import css from '@navelpluisje/rollup-plugin-css'
import pkg from './package.json'

export default [{
  input: 'src/app.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
    },
    {
      file: pkg.module,
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