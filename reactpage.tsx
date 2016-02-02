declare var React : any;
declare var ReactDOM : any;


var Contador = React.createClass({
    getInitialState: function() {
        setInterval( this.funcao , 1000 );        
        return { contador: 100 }    
    },
    funcao: function() {
        this.setState({contador: this.state.contador - 1}); 
    },
    recomecar: function() {
        this.setState({ contador: 100 });  
    },
    render: function() {
        return <p><span>{this.state.contador} </span><button onClick={this.recomecar}>Clique Aqui</button></p>;
    }
});

var App = React.createClass({
    render: function() {
        return <h1>{this.props.message}... <Contador></Contador></h1>;
    }
});

ReactDOM.render(<App message="Ola pessoal"></App>,
    document.getElementById('base'));