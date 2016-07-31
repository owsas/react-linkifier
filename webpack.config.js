module.exports = {
    context: __dirname,
    entry: './src/linkifier.js',
    externals: {
        react: true,
    },
    output: {
        path: __dirname + '/dist',
        filename: 'linkifier.js',
        library: 'linkifier',
        libraryTarget: 'umd',
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
            },
        ],
    },
};
