export default {
  input: 'assets/js/bundle/Events.js',
  output: {
    file: 'assets/js/dist/bundle.js',
    format: 'esm',  // or 'iife' if you want a script tag ready bundle
    sourcemap: true,
  }
};