const path = require('path');

module.exports = [{
    entry: path.join(__dirname, '/src/index.ts'),
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    'babel-loader',
                    'ts-loader'
                ],
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: 'bundle.es5.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'TypeScriptRestMapper',
        libraryTarget: 'umd'
    },
    mode: 'development'
}, {
    entry: path.join(__dirname, '/src/index.ts'),
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    'ts-loader'
                ],
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: 'bundle.es6.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'TypeScriptRestMapper',
        libraryTarget: 'umd'
    },
    mode: 'development'
}];
