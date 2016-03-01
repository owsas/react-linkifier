module.exports = {
    context: __dirname,
    entry: './src/index.js',
    externals: {
        react: true
    },
    output: {
        path: __dirname + '/dist',
        filename: 'linkifier.js',
        library: 'linkifier',
        libraryTarget: 'umd'
    }
};
