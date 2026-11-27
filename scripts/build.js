require('esbuild').buildSync({
  entryPoints: ['src/index.css'],
  outfile: 'dist/ripple.css',
  minify: true,
  bundle: true,
});

buildPlugin({
  entryPoints: ['builds/cdn.js'],
  outfile: 'dist/ripple.min.js',
});

buildPlugin({
  entryPoints: ['builds/module.js'],
  outfile: 'dist/ripple.esm.js',
  platform: 'neutral',
  mainFields: ['main', 'module'],
});

function buildPlugin(buildOptions) {
  return require('esbuild').buildSync({
    ...buildOptions,
    minify: true,
    bundle: true,
  });
}
