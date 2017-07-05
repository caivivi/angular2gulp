import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';

export default {
    entry: 'src/main.js',
    dest: 'aot/build.js', // output a single application bundle
    sourceMap: false,
    format: 'iife',
    onwarn: (warning) => {
        if (warning.code === 'THIS_IS_UNDEFINED') return;
        console.warn(warning.message);
    }, plugins: [
        nodeResolve({ jsnext: true, module: true }),
        commonjs({
            include: 'node_modules/rxjs/**'
        }),
        uglify()
    ]
};