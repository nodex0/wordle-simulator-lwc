import lwc from '@lwc/rollup-plugin';
import replace from '@rollup/plugin-replace';
import copy from 'rollup-plugin-copy'

export default {
    input: 'src/main.js',

    output: {
        file: 'dist/main.js',
        format: 'iife',
    },

    plugins: [
        copy({
            targets: [
                { src: 'src/index.html', dest: 'dist' },
                { src: 'src/assets/*', dest: 'dist/assets' }
            ],
            verbose: true
        }),
        replace({
            'process.env.NODE_ENV': JSON.stringify('development'),
        }),
        lwc({
            modules: [
                { "dir": "modules" }
            ]
        })
    ],
};