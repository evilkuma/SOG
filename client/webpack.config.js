const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const config = env => {

    const res = {
        mode: env,
        entry: path.join(__dirname, 'src/main.js'),
        output: {
            path: path.join(__dirname, 'dist'),
            filename: 'js/main.js'
        },
        module: {
            rules: require('./rules')
        },
        plugins: [
            new HtmlWebpackPlugin({
              hash: true,
              filename: 'index.html',
              template: path.join(__dirname, 'template.html'),
              inject: 'body'
            }),
            new webpack.DefinePlugin({
                MODE: `"${env}"`
            }),
            new webpack.ProvidePlugin({
                THREE: path.join(__dirname, 'src/THREE/THREE.js')
            })
        ]
    }

    if(env === 'production') {
        res.optimization = { minimize: true }
    } else {
        res.watch = true
        res.devtool = 'source-map'
    }

    return res

}

module.exports = config
