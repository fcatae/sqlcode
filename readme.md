Começamos com as bibliotecas mínimas no Bower:

* React
* Babel

Adicionamos:

    <div id="container"></div>
    
Em seguida, criamos o script:
    
    <script type="text/babel">
        ReactDOM.render(
            <h1>Bem vindo ao mundo HTML</h1>,
            document.getElementById('container')
        );
    </script>
    
Fácil?

Primeiro componente:

    var HelloComponent = React.createClass()
    
Mas precisamos adicionar uma implementação para render():

        var HelloComponent = React.createClass({
            render: function() {
                return <h2>Hello {this.props.name}</h2>;
            }
        });

Configurando o WebPack:
    
    npm install -g webpack
    
Adicionamos um arquivo de configuração:

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

