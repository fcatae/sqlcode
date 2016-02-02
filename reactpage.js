var Contador = React.createClass({
    getInitialState: function () {
        setInterval(this.funcao, 1000);
        return { contador: 100 };
    },
    funcao: function () {
        this.setState({ contador: this.state.contador - 1 });
    },
    recomecar: function () {
        this.setState({ contador: 100 });
    },
    render: function () {
        return React.createElement("p", null, React.createElement("span", null, this.state.contador, " "), React.createElement("button", {"onClick": this.recomecar}, "Clique Aqui"));
    }
});
var App = React.createClass({
    render: function () {
        return React.createElement("h1", null, this.props.message, "... ", React.createElement(Contador, null));
    }
});
ReactDOM.render(React.createElement(App, {"message": "Ola pessoal"}), document.getElementById('base'));
