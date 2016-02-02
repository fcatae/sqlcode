webpack
=======

multiple entry points:
http://stackoverflow.com/questions/34624263/webpack-multiple-entry-point-confusion
http://webpack.github.io/docs/configuration.html
https://github.com/petehunt/webpack-howto
https://web-design-weekly.com/2014/09/24/diving-webpack/
http://webpack.github.io/docs/multiple-entry-points.html
https://github.com/webpack/webpack/tree/master/examples/multiple-entry-points

    entry: {
        a: "./a",
        b: "./b",
        c: ["./c", "./d"]
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: "[name].entry.js"
    }

example:

    // file: webpack.production.babel.js
    import webpack from 'webpack';
    import path from 'path';

    const ROOT_PATH = path.resolve('./');

    export default {
        entry: [
            path.resolve(ROOT_PATH, "src/drag")
        ],
        resolve: {
            extensions: ["", ".js", ".scss"]
        },
        output: {
            path: path.resolve(ROOT_PATH, "build"),
            filename: "drag.min.js"
        },
        devtool: 'source-map',
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    loader: 'babel',
                    include: path.resolve(ROOT_PATH, 'src')
                },
                {
                    test: /\.scss$/,
                    loader: 'style!css!sass'
                }
            ]
        },
        plugins: [
            new webpack.optimize.UglifyJsPlugin()
        ]
    };