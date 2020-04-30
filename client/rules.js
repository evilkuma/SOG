
module.exports = [
    // JS
    {
        test: /\.js$/,
        exclude: file => /node_modules/.test(file),
        use: ['babel-loader']
    },
    // CSS
    {
        test: /\.css$/,
        use: ['css-loader']
    },
    // FILES
    {
        test: /\.(png|jpg|gif|svg|obj|txt|gif|gltf)$/,
        loader: 'file-loader',
        options: {
            name: '[name].[ext]?[hash]'
        }
    }
]
