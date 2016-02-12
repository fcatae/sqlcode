webpack
=======

A instalação do webpack é global:

    npm install webpack -g

Webpack permite definir referências a módulos commonJS:

    var numberLib = require('./number');
    var mathLib = require('./math');

    var n = numberLib;
    var sum = mathLib.sum;

    console.log(sum(n,n));

Para isso, basta rodar o comando:

    webpack main.js bundle.js

Ao final do processo, será gerado um arquivo de saída chamado bundle.js.



## Arquivo de configuração

Isso é apenas o começo da história. Na verdade, podemos substituir os processos
manuais do GULP / GRUNT. Por que não? Assim, definimos um arquivo de configuração:

    module.exports = {
    entry: './main.js',
    output: {
        filename: 'bundle.js'       
    }
    };

Agora podemos rodar o mesmo comando: 

    webpack


## Agora algo mais divertido

Por que não rodar de forma minificada:

    webpack -p
    
Ou então, deixar no modo incremental e watch mode:

    webpack --watch
    
Podemos também incluir source maps para debug: (TODO: não conheço exemplos)

    webpack -d
    
    
## Transpilers

Que tal usar um loader? JSX: jsx-loader


    

WebPack permite especificar uma página com suporte a require(), que referencia
outros componentes. Essa página é chamada de entry-point. 

        module.exports = {
        cache: true,
        entry: './index.jsx',
        output: {
            filename: 'package.js'
        },
        module: {
            loaders: [
            {test: /\.jsx/, loader: 'jsx-loader'}
            ]
        },
        externals: {
            'react': 'React',
            'react/addons': 'React'
        }
        };

O processamento de jsx (ao invés de JS) é feito usando o jsx-loader. 

## Múltiplos entry points

É possível especificar múltiplos entry-points para as páginas.

    entry: {
        a: "./a",
        b: "./b",
        c: ["./c", "./d"]
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: "[name].entry.js"
    }



multiple entry points:
https://web-design-weekly.com/2014/09/24/diving-webpack/
http://webpack.github.io/docs/multiple-entry-points.html
https://github.com/webpack/webpack/tree/master/examples/multiple-entry-points



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