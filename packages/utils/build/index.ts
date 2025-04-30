const buildLib = async (format: Array<'esm' | 'cjs'>) => {
  format.forEach(async (f) => {
    await Bun.build({
      entrypoints: ['./src/index.ts'],
      outdir: './dist',
      format: f,
      minify: true,
      naming: f === 'esm' ? 'index.js' : 'index.cjs',
      drop: ['debugger']
    })
      .then((res) => {
        res.outputs.forEach((output) => {
          console.log(output.path)
        })
      })
      .catch((err) => {
        console.error(err)
      })
  })
}

buildLib(['esm', 'cjs'])
