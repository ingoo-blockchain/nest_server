import path from 'path'
import webpack, { Configuration as WebpackConfiguration } from 'webpack'
import nodeExternals from 'webpack-node-externals'
import { RunScriptWebpackPlugin } from 'run-script-webpack-plugin'

const config: WebpackConfiguration = {
    entry: ['webpack/hot/poll?100', './src/main.ts'],
    watch: true,
    target: 'node',
    externals: [
        nodeExternals({
            allowlist: ['webpack/hot/poll?100'],
        }),
    ],
    module: {
        rules: [
            {
                test: /.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    mode: 'development',
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [new webpack.HotModuleReplacementPlugin(), new RunScriptWebpackPlugin({ name: 'server.js' })],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'server.js',
    },
}

export default config
