const { rollup } = require('rollup');
const resolve = require('@rollup/plugin-node-resolve').default;
const commonjs = require('@rollup/plugin-commonjs').default;
const builtins = require('rollup-plugin-node-builtins');
const replace = require('@rollup/plugin-replace').default;
const terser = require('@rollup/plugin-terser').default;

var fs = require('fs');

async function doBuild() {
  try {
    let bundle = await rollup({
      input: 'lib/index.js',
      plugins: [
        replace({
          'process.env.NODE_ENV': JSON.stringify( 'production' ),
          preventAssignment: true
        }),
        builtins(),
        resolve({
          preferBuiltins: false,
          browser: true
        }),
        commonjs({
        })
      ]
    });

    await bundle.write({
      file: 'dist/browser.js',
      format: 'umd',
      name: 'TechnicalIndicators'
    });

    // Also create a CommonJS build for Node.js
    await bundle.write({
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true
    });

    console.log('Build completed successfully!');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

doBuild();